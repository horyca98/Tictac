/* eslint-disable linebreak-style */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { io } from 'socket.io-client';
import Square from './Square';

import { updateHistory } from './actions';

const Board = (props) => {
  // hooks
  const {

    // eslint-disable-next-line react/prop-types
    roomID, bboardState, bwinner, bcountMove, userMark,
  } = props;
  const dispatch = useDispatch();
  const [winner, setWinner] = useState(bwinner);
  const history = useSelector((state) => state.history);
  const [boardState, setBoardState] = useState(bboardState);
  const [countMove, setCountMove] = useState(bcountMove);
  const [wasNewMove, setWasNewMove] = useState(false);
  const [isPlayable, setIsPlayable] = useState(false);
  const [isSpectable, setIsSpectable] = useState(false);
  const socket = useRef();
  // handles
  useEffect(() => {
    const ENDPOINT = 'http://localhost:5000';
    socket.current = io.connect(ENDPOINT, { transports: ['websocket'] });
    socket.current.on('connect', () => {
      socket.current.emit('join', { roomID });
    });

    socket.current.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.current.on('room_status', (status) => {
      setBoardState(status.boardState);
      setCountMove(status.countMove);
      setWinner(status.winner);
      dispatch(updateHistory(status.history[status.history.length - 1], roomID));
    });
    socket.current.on('user_join', (usersInRoom) => {
      if (usersInRoom === 2) { setIsPlayable(true); } else if (usersInRoom >= 3) {
        setIsSpectable(true);
      }
    });
  }, []);

  useEffect(async () => {
    if (wasNewMove) {
      const newRoomStatus = {
        roomID,
        history,
        winner,
        boardState,
        countMove,
      };
      socket.current.emit('update_room', newRoomStatus);
      setWasNewMove(false);
    }
  }, [wasNewMove]);
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const result = lines.filter(([a, b, c]) => {
      if (
        squares[a]
            && squares[a] === squares[b]
            && squares[a] === squares[c]
      ) {
        return squares[a];
      }
      return false;
    });
    if (result.length > 0) { return squares[result[0][0]]; }

    return null;
  };
  const handleGoHistory = (i) => {
    setBoardState(history[i].board);
    setWinner(history[i].winner);
    setCountMove(history[i].moves + 1);
  };
  const handleClick = async (i) => {
    const nextMove = countMove % 2 === 1 ? 'X' : 'O';
    if (winner) {
      alert('The game was already won!');
      return;
    }
    if (!isPlayable && isSpectable) {
      alert('You cannot play while spectating');
      return;
    }
    if (!isPlayable) {
      alert('Please wait for another user to join');
      return;
    }

    if (history && countMove !== history[history.length - 1].moves + 1) {
      alert('You cannot redo a move in the past!');
      return;
    }
    if (nextMove !== userMark) {
      alert('Please wait for your turn');
      return;
    }

    const auxBoard = [...boardState];

    if (auxBoard[i] == null && !winner) {
      auxBoard[i] = nextMove;
      setBoardState(auxBoard);
      dispatch(updateHistory({ board: auxBoard, winner, moves: countMove },
        roomID));
      setCountMove(countMove + 1);
      if (calculateWinner(auxBoard)) setWinner(nextMove);
      setWasNewMove(true);
    }
  };

  const renderSquare = (i) => <Square value={boardState[i]} handleClick={() => handleClick(i)} />;
  const status = winner
    ? `Winner is ${winner}`
    : countMove < 10
      ? `Next player: ${countMove % 2 === 1 ? 'X' : 'O'}`
      : 'Draw';
  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <ol>
        {

        !isPlayable && !isSpectable ? 'Waiting for other player to join'
          : !isPlayable && isSpectable ? 'You are now spectating'
            : history.length > 0
              ? history.map((i, move) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      handleGoHistory(move);
                    }}
                  >
                    {move > 0 ? `Go to move #${move}` : 'Go to game start'}
                  </button>
                </li>
              ))
              : 'No other move'
}
      </ol>
    </div>
  );
};
export default Board;

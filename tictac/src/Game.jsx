import React, { useState } from 'react';
import './Game.css';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-cycle
import Board from './Board';
import { addHistory, updateHistory } from './actions';

const Game = () => {
  const dispatch = useDispatch();
  const [inputRoomID, setInputRoomID] = useState('');
  const [game, setGame] = useState(null);
  const handleInputChange = (e) => {
    setInputRoomID(e.target.value);
  };

  // eslint-disable-next-line no-shadow
  
  const joinGame = (roomID) => async (dispatch) => {
    const response = await fetch(
      `/game/getGameDataById?roomID=${roomID}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const { status } = response;
    const data = await response.json();
    if (status === 200) {
      dispatch(updateHistory(data.history, data.roomID));
      setGame({ ...data, userMark: 'O' });
    } else alert('There is no room for this ID');
  };
  const handleJoinGame = () => {
    dispatch(joinGame(inputRoomID));
  };
  // eslint-disable-next-line no-shadow
  const createGame = () => async (dispatch) => {
    const response = await fetch('/game/addNewGame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: [
          { board: Array(9).fill(null), winner: null, moves: 0 },
        ],
        winner: null,
        boardState: Array(9).fill(null),
        countMove: 1,
      }),
    });
    const { status } = response;
    const data = await response.json();

    if (status === 200) {
      setGame({ ...data, userMark: 'X' });
      dispatch(addHistory(data.roomID));
    }
  };
  const handleCreateGame = () => {
    dispatch(createGame());
  };
  return (
    <div className="game">
      <div className="game-board">
        {game ? (
          <div>
            <Board
              roomID={game.roomID}
              bhistory={game.history}
              bboardState={game.boardState}
              bcountMove={game.countMove}
              bwinner={game.winner}
              userMark={game.userMark}
            />
            <div>
              Room ID:
              {game.roomID}
            </div>
          </div>
        ) : (
          <div>
            <button type="button" onClick={handleCreateGame}>
              Create new game
            </button>

            <div>
              <button type="button" onClick={handleJoinGame}>
                Join game
              </button>
              <input type="text" onChange={handleInputChange} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Game;

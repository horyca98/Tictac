import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import "./index.css";
import Square from "./Square";
import { updateHistory } from "./actions";
const Board = (id) => {
  // hooks
  const gameID = id
  const dispatch = useDispatch()
  const [winner, setWinner] = useState(false);
  const [history, setHistory] = useState([
    { board: Array(9).fill(null), winner: false, moves: 0, gameID: id},
  ]); //stack would be better
  const [boardState, setBoardState] = useState(Array(9).fill(null));
  const [countMove, setCountMove] = useState(1);
  console.log(history)
  // handles
  const handleGoHistory = (i) => {
    setBoardState(history[i].board);
    setWinner(history[i].winner);
    setCountMove(history[i].moves + 1);
  };

  const handleClick = (i) => {
    const nextMove = countMove % 2 == 1 ? "X" : "O";
    const auxBoard = [...boardState];
    let newHistory = history;

    // back in time
    if (
      history[history.length - 1].moves != countMove - 1 &&
      auxBoard[i] == null
    ) {
      newHistory = history.splice(0, countMove);
      setHistory(newHistory);
    }
    if (auxBoard[i] == null && !winner) {
      auxBoard[i] = nextMove;
      setBoardState(auxBoard);
      setHistory([
        ...newHistory,
        { board: auxBoard, winner: winner, moves: countMove,gameID: id},
      ]);
      setCountMove(countMove + 1);
      if (calculateWinner(auxBoard)) setWinner(nextMove);
    }
    dispatch(updateHistory(history,id))
  };

  const calculateWinner = (squares)=> {
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
    const result = lines.filter(([a,b,c])=>{

      if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
          ) {
            return squares[a];
          }
    })
    if (result.length>0)
      return squares[result[0][0]]
    
    return null;
  }

  const renderSquare = (i) => {
    return <Square value={boardState[i]} handleClick={() => handleClick(i)} />;
  };
  const status = winner
    ? "Winner is " + winner
    : countMove < 10
    ? "Next player: " + (countMove % 2 == 1 ? "X" : "O")
    : "Draw";
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
        {history.length > 0
          ? history.map((step, move) => {
              return (
                <li key={move}>
                  <button
                    onClick={() => {
                      handleGoHistory(move);
                    }}
                  >
                    {move > 0 ? "Go to move #" + move : "Go to game start"}
                  </button>
                </li>
              );
            })
          : "No other move"}
      </ol>
    </div>
  );
};
export default Board;

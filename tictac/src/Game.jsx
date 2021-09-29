import React from "react";
import "./index.css";
import Board from "./Board";
import { useDispatch } from "react-redux";
const Game = () => {
  const dispatch = useDispatch()
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div>
      </div>
    </div>

  );
};
export default Game;

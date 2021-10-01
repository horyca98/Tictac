import React, { useState ,useEffect} from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import "./index.css";
import Square from "./Square";
import { updateHistory } from "./actions";
const Board = (props) => {
  // hooks

  const {roomID,bboardState,bwinner,bcountMove,bhistory,userMark} = props
  const dispatch = useDispatch()
  const [winner, setWinner] = useState(bwinner);
  const [history, setHistory] = useState(bhistory); //stack would be better
  const [boardState, setBoardState] = useState(bboardState);
  const [countMove, setCountMove] = useState(bcountMove);
  const [wasNewMove,setWasNewMove] = useState(false)
  // handles
  useEffect (async ()=>{
    if(wasNewMove) {
      const response = await fetch("/game/updateGameDataById", 
      {
        method:'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({
          roomID:roomID,
          history:history,
          winner:winner,
          boardState:boardState,
          countMove:countMove,
        })
      })
      setWasNewMove(false)
    }
  },[wasNewMove]
  )
  useEffect(() => {
    const interval = setInterval(() => {
      gameStateHasChanged(interval)
    }, 1000);
  }, []);
  
  const handleGoHistory = (i) => {
    setBoardState(history[i].board);
    setWinner(history[i].winner);
    setCountMove(history[i].moves + 1);
  };
  const gameStateHasChanged = async (interval) =>{
    const response = await fetch("/game/getGameDataById?roomID="+roomID, 
    {
      method:'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const status = response.status
    if(status==200){
      const data = await response.json()
      console.log(data.countMove + "      "  + countMove)
      if(data.countMove > countMove){
        setHistory(data.history)
        setBoardState(data.boardState)
        setWinner(data.winner)
        setCountMove(data.countMove)
        if(data.winner)
          clearInterval(interval)
      }
    }
  }
  const handleClick = async (i) => {  
    const nextMove = countMove % 2 == 1 ? "X" : "O";
    if(nextMove!=userMark){
      alert("Please wait for your turn")
      return
    }
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
        { board: auxBoard, winner: winner, moves: countMove},
      ]);
      setCountMove(countMove + 1);
      if (calculateWinner(auxBoard)) setWinner(nextMove);
    }
    setWasNewMove(true)
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

import React, { useState ,useEffect,useRef} from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import "./index.css";
import Square from "./Square";
import { useSelector } from "react-redux";
import { updateHistory } from "./actions";


const Board = (props) => {
  // hooks
 
  const {roomID,bboardState,bwinner,bcountMove,bhistory,userMark} = props
  const dispatch = useDispatch()
  const [winner, setWinner] = useState(bwinner);
  // const [history, setHistory] = useState(bhistory); //stack would be better
  const history = useSelector((state)=>state.history)
  const [boardState, setBoardState] = useState(bboardState);
  const [countMove, setCountMove] = useState(bcountMove);
  const [wasNewMove,setWasNewMove] = useState(false)
  const interval = useRef(null);
  // handles
  useEffect (async ()=>{
    if(wasNewMove) {
      if(interval.current){
        clearInterval(interval.current)
      }
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
    else{
    interval.current = setInterval(async () => {
        await gameStateHasChanged()
      }, 3000);    
    }
  },[wasNewMove]
  )
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     await gameStateHasChanged(interval)
  //   }, 7000);
  // }, []);
  
  const handleGoHistory = (i) => {
      setBoardState(history[i].board);
      setWinner(history[i].winner);
      setCountMove(history[i].moves + 1);
      clearInterval(interval.current)

      if(i==history.length-1){
        interval.current = setInterval(async () => {
          await gameStateHasChanged()
        }, 3000); 
      }

    //last move
  };
  const gameStateHasChanged = async () =>{
    const response = await fetch("/game/getGameDataById?roomID="+roomID, 
    {
      method:'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const status = response.status
    if(status==200){
      const data = await response.json()
      if(calculateWinner(data.boardState)||countMove>=10){
        // console.log("INTERVAL STOP")
        clearInterval(interval.current)
      }
      if(data.countMove >countMove&& ((data.countMove%2==1 && userMark=="X")||(data.countMove%2==0&&userMark=="O"))){
        clearInterval(interval.current)
        // console.log("COUNT INSIDE IF  " + countMove)
        setBoardState(data.boardState)
        setWinner(data.winner)
        setCountMove(data.countMove)
        console.log(data.history[data.history.length-1])
        dispatch(updateHistory(data.history[data.history.length-1],roomID))
    
      }

    }
  }
  const handleClick = async (i) => {  
    console.log(history)
    const nextMove = countMove % 2 == 1 ? "X" : "O";
    if(nextMove!=userMark){
      alert("Please wait for your turn")
      return
    }
    if(history && countMove!=history[history.length-1].moves+1){
      alert("You cannot redo a move in the past!")
      return
    }
    const auxBoard = [...boardState];
    let newHistory = history;

    // back in time
    // if (
    //   history[history.length - 1].moves != countMove - 1 &&
    //   auxBoard[i] == null
    // ) {
    //   newHistory = history.splice(0, countMove);
    //   dispatch(updateHistory({historynewHistory:history,roomID:roomID}));
    // }
    if (auxBoard[i] == null && !winner) {
      auxBoard[i] = nextMove;
      setBoardState(auxBoard);
      dispatch(updateHistory({ board: auxBoard, winner: winner, moves: countMove},
        roomID))
      // setHistory([
      //   ...newHistory,
      //   { board: auxBoard, winner: winner, moves: countMove},
      // ]);
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

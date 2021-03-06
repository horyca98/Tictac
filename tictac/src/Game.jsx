import React from "react";
import "./index.css";
import Board from "./Board";
import { useDispatch } from "react-redux";
import {useState} from "react"
import { addHistory } from "./actions";

const Game = () => {
  const dispatch = useDispatch()
  const [roomID, setRoomID] = useState(null)
  const [inputRoomID,setInputRoomID] = useState('')
  const [game,setGame] = useState(null)
  const handleInputChange = (e) =>{
    setInputRoomID(e.target.value)
  }
  const handleJoinGame = async() =>{
    const response = await fetch("/game/getGameDataById?roomID="+inputRoomID, 
    {
      method:'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const status = response.status
  
    const data = await response.json()
    console.log(data)
    dispatch(data.history)
    if(status == 200){
      setGame({...data,userMark:"O"})
    }
    else alert("There is no room for this ID")
  }
  const handleGameCreate = async () =>{
    const response = await fetch("/game/addNewGame", 
          {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
              history:[
                { board: Array(9).fill(null), winner: null, moves: 0},
              ],
              winner:null,
              boardState:Array(9).fill(null),
              countMove:1,
            }) 
          }
    )
    
    const data = await response.json() 
    console.log(data)
    dispatch(addHistory(data.roomID))
    setGame({...data,userMark:"X"})
  }
  return (
    <div className="game">
      <div className="game-board">
        {game ? 
        <div><Board roomID = {game.roomID} bhistory = {game.history} bboardState = {game.boardState} bcountMove = {game.countMove} bwinner = {game.winner} userMark = {game.userMark}/><div>Room ID: {game.roomID}</div></div> :
        (
        <div><button onClick = {handleGameCreate}>Create new game</button>
        
        <div><button onClick = {handleJoinGame}>Join game</button>
        <input type="text" onChange = {handleInputChange}/></div>
        
        </div>
        )

        }
        
      </div>
    </div>

  );
};
export default Game;

const express = require("express");
const app = express();
const connectDB = require("./connection")();
const router = express.Router();
const Game = require('./Game')
const mongoose = require('mongoose')


router.post("/addNewGame",async (req,res)=>{
  const {winner,history,countMove,boardState} = req.body
  const newGame = new Game({
    winner:winner,
    history:history,
    countMove:countMove,
    boardState:boardState,
  })
  const result = await newGame.save()
  return res.status(200).json(result)
})


router.put("/updateGameDataById",async (req,res)=>{
  const {roomID,winner,history,countMove,boardState} = req.body
  try{
    const game = await Game.findOneAndUpdate({roomID:roomID},{roomID:roomID,winner:winner,history:history,countMove:countMove,boardState:boardState})
    return res.status(200).json({msg:"success"})
  }
  catch(e){
    console.log(e)
    return res.status(500).json({msg:e})
  }

})


router.get("/getGameDataById", async function (req, res) {
  const roomID = req.query.roomID;
  try{
    const game = await Game.findOne({roomID:roomID})
    res.status(200).json({boardState:game.boardState,winner:game.winner,history:game.history,countMove:game.countMove,roomID:parseInt(roomID)})
  }
  catch(e){
    res.status(500).json({message:"Room id not found"})
  }
})

module.exports = router;

const express = require('express');
require('./connection')();

const Game = require('./Game');

const router = express.Router();

require('mongoose');

router.post('/addNewGame', async (req, res) => {
  const {
    winner, history, countMove, boardState,
  } = req.body;
  const newGame = new Game({
    winner,
    history,
    countMove,
    boardState,
  });
  const result = await newGame.save();
  return res.status(200).json(result);
});

router.put('/updateGameDataById', async (req, res) => {
  const {
    roomID, winner, history, countMove, boardState,
  } = req.body;

  try {
    await Game.findOneAndUpdate(
      { roomID },
      {
        roomID,
        winner,
        history,
        countMove,
        boardState,
      },
    );
    return res.status(200).json({ msg: 'success' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e });
  }
});

router.get('/getGameDataById', async (req, res) => {
  const { roomID } = req.query;

  try {
    const game = await Game.findOne({ roomID });
    res.status(200).json({
      boardState: game.boardState,
      winner: game.winner,
      history: game.history,
      countMove: game.countMove,
      roomID: parseInt(roomID, 10),
    });
  } catch (e) {
    res.status(500).json({ message: 'Room id not found' });
  }
});

module.exports = router;

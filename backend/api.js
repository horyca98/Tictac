const express = require('express');

const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const userRouter = require('./gameRouter');
const Game = require('./Game');
require('mongoose');
require('./connection')();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/game', userRouter);
io.on('connection', (socket) => {
  socket.on('join', (obj) => {
    socket.join(obj.roomID);
    const roomSize = io.sockets.adapter.rooms.get(obj.roomID).size;
    if (roomSize >= 2) {
      io.to(obj.roomID).emit('user_join', roomSize);
    }
  });
  socket.on('update_room', async (roomStatus) => {
    try {
      await Game.findOneAndUpdate(
        { roomID: roomStatus.roomID },
        {
          roomID: roomStatus.roomID,
          winner: roomStatus.winner,
          history: roomStatus.history,
          countMove: roomStatus.countMove,
          boardState: roomStatus.boardState,
        },
      );
      socket.to(roomStatus.roomID).emit('room_status', roomStatus);
    } catch (e) {
      socket
        .to(roomStatus.roomID)
        .emit('room_status', 'Could not save to database');
      console.log(e);
    }
  });
});

http.listen(5000, () => {
  console.log('Starting server');
});

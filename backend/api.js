const express = require("express");
const app = express();
const http = require('http').Server(app)
const cors = require("cors");
const pool = require("./connection.js");
const userRouter = require("./gameRouter.js");
const io = require("socket.io")(http,{cors: {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
}})
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/game", userRouter);
io.on("connection", (socket) => {
  console.log(socket.id); 
  socket.on("click", (message)=>{
    console.log(message)
    io.emit("receive",message)
  })
});
io.on("disconnect",(socket) => {
  console.log("DISCONNECT")
  console.log(socket.id); 
});


http.listen(5000, () => {
  console.log("Starting server");
});

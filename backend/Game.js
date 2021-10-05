const mongoose = require('mongoose')
const autoIncrement = require("mongoose-auto-increment");

const game = new mongoose.Schema({
    winner:{
        type:String
    },
    history:{
        type:Object
    },
    countMove:{
        type:Number
    },
    boardState:{
        type:Array
    },
    roomID:{
        type:Number,
        unique:true
    },
});
autoIncrement.initialize(mongoose.connection);
game.plugin(autoIncrement.plugin, {
    model: "game", // collection or table name in which you want to apply auto increment
    field: "roomID", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
  });
  
module.exports= Game = mongoose.model('game',game)
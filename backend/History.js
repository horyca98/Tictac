const mongoose = require('mongoose')
const game = new mongoose.Schema({
    winner:{
        type:Boolean
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
});
module.exports= Game = mongoose.model('game',game)
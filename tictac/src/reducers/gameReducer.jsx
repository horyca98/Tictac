import * as types from '../constants/ActionTypes'
let gameHistoryID = 0
const game = (state=[],action) =>{
    switch(action.type){
        case types.ADD_HISTORY:
            const newGame = {...action.payload,id:gameHistoryID}
            gameNextID++;
            console.log(newGame)
            return [...state,newGame]
        case types.DELETE_HISTORY:
            return state.filter(game=>game.id !=action.payload.gameID);
        case types.UPDATE_HISTORY:
            const histo = state.find(el=>el.gameID==action.payload.gameID)
            
        default:
            return state;
    }
}
export default game
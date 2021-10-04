import * as types from '../constants/ActionTypes'
let historyID = 0
const history = (state=[],action) =>{
    switch(action.type){
        case types.ADD_HISTORY:
            const newHistory =[{board: Array(9).fill(null), winner: null, moves: 0,roomID:action.payload.roomID}]
            return {...state,history:[{board: Array(9).fill(null), winner: null, moves: 0,roomID:action.payload.roomID}]}
        case types.DELETE_HISTORY:
            return state.filter(game=>game.id !=action.payload.gameID);
        case types.UPDATE_HISTORY:
            return {history:action.payload.history.history}
            
        default:
            return state;
    }
}
export default history
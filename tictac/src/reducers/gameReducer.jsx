import * as types from '../constants/ActionTypes'
let historyID = 0
const history = (state={},action) =>{
    switch(action.type){
        case types.ADD_HISTORY:
            const newHistory =[{board: Array(9).fill(null), winner: null, moves: 0,roomID:action.payload.roomID}]
            return {...state,history:newHistory}
        case types.DELETE_HISTORY:
            return state.filter(game=>game.id !=action.payload.gameID);
        case types.UPDATE_HISTORY:
            console.log(action.payload.history)
            if(state.history){
                return {...state,history:[...state.history,{...action.payload.history,roomID:action.payload.roomID}]}
            }
            else{   
                return {...state,history:action.payload.history.map((e)=> {
                    return {...e,roomID:action.payload.roomID}
                    })
                }
            }
            
        default:
            return state;
    }
}
export default history
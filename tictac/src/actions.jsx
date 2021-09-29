import * as types from './constants/ActionTypes'
export const addHistory = (game)=>({
    type:types.ADD_HISTORY,
    payload:game
})
export const deleteHistory = (gameID) =>({
    type:types.DELETE_HISTORY,
    payload:gameID
})
export const updateHistory = (history,gameID) => ({
    type:types.UPDATE_HISTORY,
    payload:{
        history:history,
        gameID:gameID
    }
})
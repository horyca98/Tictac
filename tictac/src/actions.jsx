import * as types from './constants/ActionTypes'
export const addHistory = (roomID)=>({
    type:types.ADD_HISTORY,
    payload:{roomID:roomID}
})
export const deleteHistory = (roomID) =>({
    type:types.DELETE_HISTORY,
    payload:roomID
})
export const updateHistory = (history,roomID) => ({
    type:types.UPDATE_HISTORY,
    payload:{
        history:history,
        roomID:roomID
    }
})
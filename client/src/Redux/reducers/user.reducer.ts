import {IUserReducer } from "../types"

const initialState: IUserReducer = {};

function userReducer(state: IUserReducer = initialState, action: any): IUserReducer {
  switch(action.type) {
    default: return state

  }
}

export default userReducer
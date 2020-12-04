import {IAuthState } from "../types"

const initialState: IAuthState = {};

function authReducer(state: IAuthState = initialState, action: any): IAuthState {
  switch(action.type) {
    default: return state

  }
}

export default authReducer
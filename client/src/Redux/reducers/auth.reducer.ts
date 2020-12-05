import { IAuthState } from '../types';
import { AuthConstants as Ac } from '../constants';

const initialState: IAuthState = {
  isAuth: false,
};

function authReducer(
  state: IAuthState = initialState,
  action: any,
): IAuthState {
  switch (action.type) {
    case Ac.SIGN_IN:
      return { ...state, isAuth: true };
    case Ac.LOGOUT:
      return { ...state, isAuth: false };

    default:
      return state;
  }
}

export default authReducer;

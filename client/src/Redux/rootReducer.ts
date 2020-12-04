import { combineReducers } from 'redux';
import authReducer  from './reducers/auth.reducer';
import appReducer  from './reducers/app.reducer';
import userReducer from './reducers/user.reducer';

export default combineReducers({
  auth: authReducer,
  app: appReducer,
  user: userReducer
})
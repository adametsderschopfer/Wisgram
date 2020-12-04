import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./rootReducer";
import { IRootState } from './types'

const store = createStore<IRootState, any, any, any>(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store

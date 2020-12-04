import { IAppState } from './../types';
import { AppConstants as Ac } from '../constants';

const initialState: IAppState = {
  isLoading: false,
  alert_content: '',
};

function appReducer(state: IAppState = initialState, action: any) {
  switch (action.type) {
    // Fill & clear snackBar
    case Ac.ALERT_FILL_CONTENT:
      return { ...state, alert_content: action.alert_content };
    case Ac.ALERT_CLEAR_CONTENT:
      return { ...state, alert_content: action.alert_content };

    // working with loading
    case Ac.LOADING_ON:
      return { ...state, isLoading: true };
    case Ac.LOADING_OFF:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}

export default appReducer;

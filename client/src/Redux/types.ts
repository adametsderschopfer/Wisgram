export interface IAppState {
  isLoading: boolean;
  alert_content: string;
  isAlertCall: boolean;
}

export interface IAuthState {
  isAuth: boolean
}

export interface IUserReducer {}

export interface IRootState {
  app: IAppState;
  auth: IAuthState;
  user: IUserReducer;
}

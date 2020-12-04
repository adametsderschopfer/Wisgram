export interface IAppState {
  isLoading: boolean;
  alert_content: string;
}

export interface IAuthState {}

export interface IUserReducer {}

export interface IRootState {
  app: IAppState;
  auth: IAuthState;
  user: IUserReducer;
}

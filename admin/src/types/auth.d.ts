export interface LoginType {
  email: string;
  password: string;
}
export interface LoginStateFulfilled {
  accessToken: string;
  name: string;
  message: string;
}

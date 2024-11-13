export interface SignUpState {
  email: string;
  message: string;
}

export interface LoginState {
  accessToken: string;
  name: string;
  message: string;
}

export interface VerifySignUpState {
  accessToken: string;
  name: string;
  message: string;
}

export interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

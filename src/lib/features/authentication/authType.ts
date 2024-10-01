export interface User {
  email: string;
  otp: string;
  message: string;
}

export interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

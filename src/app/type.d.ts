export interface JwtPayload {
  exp: number;
}

export interface ErrorType {
  response: {
    data: {
      message: string;
    };
  };
}

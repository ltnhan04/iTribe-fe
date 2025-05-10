export interface JwtPayload {
  exp: number;
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
}

export interface ErrorType {
  response: {
    data: {
      message: string;
    };
  };
}

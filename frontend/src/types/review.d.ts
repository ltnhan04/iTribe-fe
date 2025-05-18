export interface IResponseReview {
  message: string;
  data: Data;
}

export interface IReview {
  variant: string;
  user: string;
  rating: number;
  comment: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

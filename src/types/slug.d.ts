export interface Color {
  colorName: string;
  colorCode: string;
}

export interface Review {
  _id: string;
  variant: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  color: Color;
  storage: string;
  rating?: number;
  reviews?: Review[];
}

export interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface ErrorType {
  response: {
    data: {
      message: string;
    };
  };
} 
export interface Color {
  colorName: string;
  colorCode: string;
}

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  images: string[];
  color: Color;
  storage: string;
  rating?: number;
  reviews?: number;
}

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
  stock_quantity: number;
  images: string[];
  color: Color;
  storage: string;
  rating?: number;
  reviews?: number;
  
  // Thông số kỹ thuật
  screen?: string;
  chip?: string;
  ram?: string;
  camera?: string;
  battery?: string;
} 
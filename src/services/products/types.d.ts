/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IResponseProduct {
  message: string;
  data: Product[];
}

export interface Product {
  _id: string;
  category: string;
  name: string;
  description: string;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Variant {
  color: Color;
  _id?: string;
  product: string;
  rating?: number;
  storage: string;
  price: number;
  stock_quantity: number;
  slug?: string;
  images: string[];
  reviews?: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  status?: string;
}

export interface Color {
  colorName: string;
  colorCode: string;
}

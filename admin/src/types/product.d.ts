/* eslint-disable @typescript-eslint/no-explicit-any */

import type { GetProp, UploadProps } from "antd";

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export interface ErrorResponse {
  error: string;
}
export interface IResponseProductList {
  message: string;
  data: IProduct[];
}
export interface IResponseProduct {
  message: string;
  data: IProduct;
}

export interface IProduct {
  category: { _id: string; name: string };
  name: string;
  description: string;
  variants: Variant[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Variant {
  color: Color;
  _id: string;
  product: string;
  rating: number;
  storage: string;
  price: number;
  stock_quantity: number;
  slug: string;
  images: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface INewProduct {
  category: { _id: string; name: string };
  name: string;
  description: string;
}

export interface IResponseProductVariant {
  message: string;
  data: IProductVariant;
}

export interface IProductVariant {
  color: Color;
  _id: string;
  product: string;
  rating: number;
  storage: string;
  price: number;
  stock_quantity: number;
  slug: string;
  color: Color;
  status: "in_stock" | "out_of_stock";
  images: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Color {
  colorName: string;
  colorCode: string;
}

export interface Review {
  id: number;
  user_id: number;
  product_variant_id: number;
  rating: number;
  comment: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}
export interface VariantFilters {
  storage: string;
  price: number | null;
  stock: number | null;
  status: "in_stock" | "out_of_stock" | null;
}

export interface User {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  category_name: string;
  parent_category_id: number | null;
}

export interface Product {
  id: number;
  category_id: number;
  product_name: string;
  description: string;
}

export interface Color {
  name: string;
  code: string;
}

export type ProductStatus = "out of stock" | "in stock";

export interface ProductVariant {
  id: number;
  product_id: number;
  storage: string;
  price: number;
  stock_quantity: number;
  slug: string;
  rating: number;
  color: Color;
  status: ProductStatus;
  images: string[];
}

export interface CartItem extends ProductVariant {
  quantity: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

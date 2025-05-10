export interface Product {
  _id: string;
  name: string;
  variants: ProductVariant[];
}

export interface Category {
  id: number;
  category_name: string;
  parent_category_id: number | null;
}

export interface Color {
  colorName: string;
  colorCode: string;
}

export type ProductStatus = "out of stock" | "in stock";

export interface ProductVariant {
  _id: string;
  product: string;
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

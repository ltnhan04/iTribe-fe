export interface Products {
  _id: string;
  price: number;
  name: string;
  colors: Color[];
  storages: string[];
  image: string | null;
  status: string;
  slug: string;
}
export interface Color {
  colorName: string;
  colorCode: string;
}

export interface Review {
  _id: string;
  productId: string;
  user: { name: string; email: string };
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  _id: string;
  name: string;
  storage: string;
  price: number;
  stock: number;
  slug: string;
  images: string[];
  color: Color;
  rating: number;
  reviews: Review[];
}

interface Product {
  _id: string;
  name: string;
  description: string;
  variants: Variant[];
  reviews: Review[];
}

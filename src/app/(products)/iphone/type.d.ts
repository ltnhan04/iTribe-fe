export interface Color {
  colorName: string;
  colorCode: string;
}

interface Review {
  _id: string;
  productId: string;
  user: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Variant {
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

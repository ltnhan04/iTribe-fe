export interface Product {
  productId: string;
  productName: string;
  productColor: string;
  productColorCode: string;
  productStorage: string;
  productPrice: number;
  quantity: number;
  productImages: string[];
}
export interface User {
  _id: string;
  name: string;
}
export interface ProductVariant {
  productVariant: ProductVariant2;
  quantity: number;
  _id: string;
}

export interface ProductVariant2 {
  _id: string;
  name: string;
  color: Color;
  storage: string;
  price: number;
  stock: number;
  images: string[];
}
type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  _id: string;
  user: User;
  productVariants: ProductVariant[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ErrorType {
  response: {
    data: {
      message: string;
    };
  };
}


export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancel";
export type PaymentMethod = "stripe" | "momo" | "ship-cod";

export interface ProductVariant {
  _id: string;
  name: string;
  storage: string;
  color: {
    colorName: string;
  };
  price: number;
  images: string[];
}

export interface OrderDetails {
  _id: string;
  order_id: string;
  product_variant_id: string;
  quantity: number;
  price: number;
  product_variant: ProductVariant;
}
export interface IResponseDetailOrder {
  message: string;
  data: OrderList;
}
export interface IResponseOrderSingle {
  message: string;
  data: OrderList[];
}

export interface IResponseOrderList {
  message: string;
  data: OrderList[];
}

export interface OrderList {
  _id: string;
  user: User;
  variants: Variant1[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  stripeSessionId: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Variant1 {
  variant?: Variant2;
  quantity: number;
  _id: string;
}

export interface Variant2 {
  _id: string;
  color: Color;
  storage: string;
  images: string[];
}

export interface Color {
  colorName: string;
  colorCode: string;
}

export interface IResponseOrder {
  message: string;
  order: Order;
}

export interface Order {
  user: User;
  variants: Variant[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  stripeSessionId: string | null;
  _id: string;
  order_details: OrderDetails[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Variant {
  variant: string;
  quantity: number;
  _id?: string;
}

export interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

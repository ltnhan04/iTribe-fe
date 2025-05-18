export interface OrderType {
  variants: Variant[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string | "ship-cod";
}

export interface Variant {
  variant: string;
  quantity: number;
}

export interface Orders {
  message: string;
  orders: Order[];
}

export interface Order {
  _id: string;
  user: User;
  variants: Variant1[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
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
  price: number;
  images: string[];
}

export interface Color {
  colorName: string;
  colorCode: string;
}

export interface OrderDetails {
  _id: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
}

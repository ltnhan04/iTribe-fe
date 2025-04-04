export interface OrderType {
  variants: ProductVariant[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string | "ship-cod";
}

export interface Variant {
  variant: string;
  quantity: number;
}

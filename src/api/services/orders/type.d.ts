export interface OrderType {
  productVariants: ProductVariant[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string | undefined;
}

export interface ProductVariant {
  productVariant: string;
  quantity: number;
}

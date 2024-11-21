export interface PaymentType {
  productVariants: ProductVariant[];
  orderId: string;
}

export interface ProductVariant {
  productVariant: string;
  quantity: number;
}

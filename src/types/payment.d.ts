export interface PaymentType {
  variants: Variant[];
  orderId: string;
}

export interface ProductVariant {
  variant: string;
  quantity: number;
}

export interface OrderType {
    productVariants: ProductVariant[]
    totalAmount: number
    shippingAddress: string
    paymentMethod: string
  }
  
  export interface ProductVariant {
    productVariant: string
    quantity: number
  }
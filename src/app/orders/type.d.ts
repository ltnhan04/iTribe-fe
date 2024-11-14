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

export interface Order {
  orderId: string;
  user: { id: string; name: string };
  products: Product[];
  totalAmount: number;
  status: "pending" | "processing" | "delivered" | "cancel";
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

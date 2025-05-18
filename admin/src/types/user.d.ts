export interface IResponseCustomer {
  message: string;
  data: Customer[];
}

export type UserRole = "customer" | "admin";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  reviews: Review[];
}

export interface Review {
  id: number;
  user_id: number;
  product_variant_id: number;
  rating: number;
  comment: string;
  created_at: string;
  product_variant: {
    id: number;
    name: string;
    storage: string;
    color: string;
    price: number;
    images: string[];
  };
}

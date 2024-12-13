export type Promotion = {
  _id: string;
  code: string;
  discountPercentage: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  maxUsage: number;
  usedCount: number;
};

export interface ErrorType {
  response: {
    data: {
      message: string;
    };
  };
}

export interface UserAddress {
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  country: string;
}

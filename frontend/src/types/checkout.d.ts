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

export interface UserAddress {
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  country: string;
}
export interface ShippingMethod {
  _id: string;
  name: string;
  basePrice: number;
  isActive: boolean;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ShippingMethodSectionProps {
  isLoadingMethods: boolean;
  shippingMethods:
    | {
        data: ShippingMethod[];
      }
    | undefined;
  selectedShippingMethod: string;
  handleShippingMethodChange: (value: string) => void;
}

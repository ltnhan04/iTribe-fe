export interface FormValues {
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  usedCount?: number;
  maxUsage: number;
  minOrderAmount: number;
}

export interface DataType {
  key: React.Key;
  _id: string;
  code: string;
  discountPercentage: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  status: string;
  usedCount?: number;
  maxUsage: number;
  minOrderAmount: number;
}

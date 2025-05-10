export interface ApplyPromotionProps {
  code: string;
  totalAmount: number;
}

export interface IResponsePoints {
  message: string;
  data: IPoints;
}

export interface IPoints {
  points: number;
}

export interface IResponseExchangeVoucher {
  message: string;
  data: ExchangeVoucher;
}

export interface ExchangeVoucher {
  customer: string;
  code: string;
  discountAmount: number;
  pointsUsed: number;
  validFrom: string;
  validTo: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IResponseVoucherList {
  message: string;
  data: IVoucherList[];
}

export interface IVoucherList {
  _id: string;
  customer: string;
  code: string;
  discountAmount: number;
  pointsUsed: number;
  validFrom: string;
  validTo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IResponseAppliedVoucher {
  message: string;
  data: IAppliedVoucher;
}

export interface IAppliedVoucher {
  discountedTotal: number;
  voucherId: string;
  discountAmount: number;
}

export interface IResponseUpdatedVoucherStatus {
  message: string;
  data: IUpdatedVoucherStatus;
}

export interface IUpdatedVoucherStatus {
  _id: string;
  customer: string;
  code: string;
  discountAmount: number;
  pointsUsed: number;
  validFrom: string;
  validTo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  usedOrder: string;
}

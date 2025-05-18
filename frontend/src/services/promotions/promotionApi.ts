import { axiosInstance } from "@/config/axiosInstance";
import {
  IResponsePoints,
  IResponseExchangeVoucher,
  IResponseVoucherList,
} from "@/types/promotion";

export const retrievePoints = async (): Promise<IResponsePoints> => {
  const res = await axiosInstance.get("/api/v1/points/");
  return res.data;
};

export const exchangeVoucher = async (
  pointsToUse: number
): Promise<IResponseExchangeVoucher> => {
  const res = await axiosInstance.post("/api/v1/points/exchange-voucher", {
    pointsToUse,
  });
  return res.data;
};

export const getVouchers = async (): Promise<IResponseVoucherList> => {
  const res = await axiosInstance.get("/api/v1/points/vouchers");
  return res.data;
};

export const applyVoucher = async (voucherCode: string, orderTotal: number) => {
  const res = await axiosInstance.post("/api/v1/points/apply", {
    voucherCode,
    orderTotal,
  });
  return res.data;
};

export const updateVoucherAsUsed = async (
  voucherId: string,
  orderId: string
) => {
  const res = await axiosInstance.put("/api/v1/points/status", {
    voucherId,
    orderId,
  });
  return res.data;
};

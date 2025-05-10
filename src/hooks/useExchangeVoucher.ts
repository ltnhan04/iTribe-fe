import {
  retrievePoints,
  exchangeVoucher,
  getVouchers,
  applyVoucher,
  updateVoucherAsUsed,
} from "@/services/promotions/promotionApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRetrievePoints = () => {
  return useQuery({
    queryKey: ["points"],
    queryFn: retrievePoints,
  });
};

export const useExchangeVoucher = () => {
  return useMutation({
    mutationFn: (pointsToUse: number) => exchangeVoucher(pointsToUse),
  });
};

export const useGetVouchers = () => {
  return useQuery({
    queryKey: ["vouchers"],
    queryFn: getVouchers,
  });
};

export const useApplyVoucher = () => {
  return useMutation({
    mutationFn: ({
      voucherCode,
      orderTotal,
    }: {
      voucherCode: string;
      orderTotal: number;
    }) => applyVoucher(voucherCode, orderTotal),
  });
};

export const useUpdateVoucherAsUsed = () => {
  return useMutation({
    mutationFn: ({
      voucherId,
      orderId,
    }: {
      voucherId: string;
      orderId: string;
    }) => updateVoucherAsUsed(voucherId, orderId),
  });
};

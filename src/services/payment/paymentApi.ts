import { axiosInstance } from "@/config/axiosInstance";
import type { PaymentType } from "@/services/payment/type";

export const createCheckoutSession = async ({
  variants,
  orderId,
}: PaymentType) => {
  return await axiosInstance.post("/api/v1/payment/create-checkout-session", {
    variants,
    orderId,
  });
};

export const updateOrderPayment = async ({
  sessionId,
  orderId,
}: {
  sessionId: string;
  orderId: string;
}) => {
  return await axiosInstance.post("/api/v1/orders/update-order-payment", {
    sessionId,
    orderId,
  });
};

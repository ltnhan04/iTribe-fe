import { axiosInstance } from "@/config/axiosInstance";
import type { PaymentType } from "@/api/services/payment/type";

export const createCheckoutSession = async ({
  productVariants,
  orderId,
}: PaymentType) => {
  return await axiosInstance.post("/api/payment/create-checkout-session", {
    productVariants,
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
  return await axiosInstance.post("/api/orders/update-order-payment", {
    sessionId,
    orderId,
  });
};

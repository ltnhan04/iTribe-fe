import { axiosInstance } from "@/config/axiosInstance";
import { PaymentType } from "@/types/payment";

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

export const createMomoPayment = async (data: {
  orderId: string;
  amount: string;
  orderInfo: string;
}) => {
  const response = await axiosInstance.post(
    `/api/v1/payment/momo/create`,
    data
  );
  return response;
};
export const updateMomoPaymentStatus = async (orderId: string) => {
  const response = await axiosInstance.post(
    `/api/v1/payment/momo/transaction-status`,
    { orderId }
  );
  return response;
};

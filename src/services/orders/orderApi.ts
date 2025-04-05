import { axiosInstance } from "@/config/axiosInstance";
import type { OrderType } from "@/services/orders/type";

export const createOrder = async (checkoutData: OrderType) => {
  return await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/orders/`,
    checkoutData
  );
};

export const cancelOrder = async (orderId: string) => {
  return await axiosInstance.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/orders/${orderId}`
  );
};

export const getOrders = async () => {
  return await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/orders/`
  );
};

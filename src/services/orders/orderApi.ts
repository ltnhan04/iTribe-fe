import { axiosInstance } from "@/config/axiosInstance";
import { OrderType, Orders } from "@/types/order";

export const createOrder = async (checkoutData: OrderType) => {
  return await axiosInstance.post(`/api/v1/orders/`, checkoutData);
};

export const cancelOrder = async (orderId: string) => {
  return await axiosInstance.put(`/api/v1/orders/${orderId}`);
};

export const getOrders = async (): Promise<Orders> => {
  const res = await axiosInstance.get(`/api/v1/orders/`);
  return res.data;
};

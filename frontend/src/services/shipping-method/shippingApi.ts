import { axiosInstance } from "@/config/axiosInstance";
export const methodShipping = async (province: string) => {
  const res = await axiosInstance.get(
    `/api/v1/shipping/methods?province=${province}`
  );
  return res.data;
};
export const shippingFree = async (methodId: string, province: string) => {
  const res = await axiosInstance.post(`/api/v1/shipping/calculate-fee`, {
    methodId,
    province,
  });
  return res.data;
};

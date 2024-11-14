import { axiosInstance } from "@/config/axiosInstance";
import { ApplyPromotionProps } from "@/api/services/promotions/type";

export const applyPromotion = async ({
  code,
  totalAmount,
}: ApplyPromotionProps) => {
  return await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/promotions/apply`,
    { code, totalAmount }
  );
};

export const getPromotions = async () => {
  return await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/promotions/active`
  );
};

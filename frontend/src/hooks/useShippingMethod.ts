import { useQuery } from "@tanstack/react-query";
import {
  shippingFree,
  methodShipping,
} from "@/services/shipping-method/shippingApi";
export const useShippingMethods = (province: string) => {
  return useQuery({
    queryKey: ["shipping-methods", province],
    queryFn: () => methodShipping(province),
    enabled: !!province,
  });
};
export const useShippingFee = (methodId: string, province: string) => {
  return useQuery({
    queryKey: ["shipping-fee", methodId, province],
    queryFn: () => shippingFree(methodId, province),
    enabled: !!methodId && !!province,
  });
};

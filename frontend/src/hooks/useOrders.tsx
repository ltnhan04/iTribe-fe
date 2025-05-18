import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  cancelOrder,
  getOrders,
} from "@/services/orders/orderApi";
import { OrderType } from "@/types/order";

export const useOrders = () => {
  const queryClient = useQueryClient();
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  const createOrderMutation = useMutation({
    mutationFn: (checkoutData: OrderType) => createOrder(checkoutData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
  return {
    orders,
    isLoading,
    error,
    createOrder: createOrderMutation.mutateAsync,
    cancelOrder: cancelOrderMutation.mutateAsync,
  };
};

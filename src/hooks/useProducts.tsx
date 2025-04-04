import { useQuery } from "@tanstack/react-query";
import {
  getProductsByCategory,
  getProductBySlug,
} from "@/services/products/productsApi";

export const useGetProductByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["product", categoryId],
    queryFn: () => getProductsByCategory(categoryId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
    enabled: !!categoryId,
  });
};

export const useGetProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
    enabled: !!slug,
  });
};

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getProductsByCategory,
  getProductBySlug,
} from "@/services/products/productsApi";
import { Product } from "@/types/product";

interface ProductsResponse {
  data: Product[];
}

const ITEMS_PER_PAGE = 10;

export const useGetProductByCategory = (categoryId: string) => {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ["product", categoryId],
    queryFn: () => getProductsByCategory(categoryId),
    getNextPageParam: (lastPage, allPages) => {
      const allVariants = lastPage.data.flatMap((p) => p.variants);
      const currentPage = allPages.length;
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;

      return endIndex < allVariants.length ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
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

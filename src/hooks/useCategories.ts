import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getSubCategories,
} from "@/services/categories/categoriesApi";

export const useCategory = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 50,
  });
};

export const useSubCategory = (parentCategoryId: string) => {
  return useQuery({
    queryKey: ["subcategory", parentCategoryId],
    queryFn: () => getSubCategories(parentCategoryId),
    staleTime: 1000 * 60 * 50,
  });
};

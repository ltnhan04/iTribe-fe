import { axiosInstance } from "@/config/axiosInstance";
import { Category } from "@/types/category";

export const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get<{ categories: Category[] }>(
    `/api/v1/admin/categories/`
  );
  return res.data.categories.filter((category) => !category.parent_category);
};

export const getSubCategories = async (parentCategoryId: string) => {
  const res = await axiosInstance.get(
    `/api/v1/admin/categories/${parentCategoryId}`
  );
  return res.data;
};

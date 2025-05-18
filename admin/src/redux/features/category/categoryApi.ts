import { baseApi } from "../../api/baseApi";
import {
  IResponseCategory,
  IResponseCategories,
  Category,
  IResponseDeletedCategory,
} from "../../../types/category";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<IResponseCategory, Omit<Category, "_id">>({
      query: (newCategory) => ({
        url: `/api/v1/admin/categories`,
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category", "Product", "ProductVariant", "Promotion"],
    }),
    getCategories: builder.query<IResponseCategories, void>({
      query: () => ({
        url: `/api/v1/admin/categories/`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<Category, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/categories/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    editCategory: builder.mutation<
      IResponseCategory,
      { id: string; updateCategory: Partial<Omit<Category, "_id">> }
    >({
      query: ({ id, updateCategory }) => {
        return {
          url: `/api/v1/admin/categories/${id}`,
          method: "PUT",
          body: updateCategory,
        };
      },
      invalidatesTags: ["Category", "Product", "ProductVariant", "Promotion"],
    }),
    deleteCategory: builder.mutation<IResponseDeletedCategory, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Product", "ProductVariant", "Promotion"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useGetCategoryByIdQuery,
} = categoryApi;

import { baseApi } from "../../api/baseApi";
import type {
  INewProduct,
  IResponseProduct,
  IResponseProductList,
} from "../../../types/product";

export const productApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProducts: builder.query<IResponseProductList, void>({
      query: () => "/api/v1/admin/products",
      providesTags: ["Product"],
    }),

    getProduct: builder.query<IResponseProduct, string>({
      query: (id) => `/api/v1/admin/products/${id}`,
    }),

    createProduct: builder.mutation<IResponseProduct, INewProduct>({
      query: (product) => ({
        url: "/api/v1/admin/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<
      IResponseProduct,
      { id: string; product: Partial<INewProduct> }
    >({
      query: ({ id, product }) => ({
        url: `/api/v1/admin/products/${id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    getProductsByCategory: builder.query<IResponseProductList, string>({
      query: (categoryId) => ({
        url: `/api/v1/admin/products/filter?categoryId=${categoryId}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByCategoryQuery,
} = productApi;

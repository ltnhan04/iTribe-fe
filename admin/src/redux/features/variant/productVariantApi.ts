import { baseApi } from "../../api/baseApi";
import type { IResponseProductVariant } from "../../../types/product";

export const productVariantApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDetailsVariant: builder.query<IResponseProductVariant, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/products/variant/${id}`,
        method: "GET",
      }),
      providesTags: ["ProductVariant"],
    }),
    createProductVariant: builder.mutation<IResponseProductVariant, FormData>({
      query: (formData) => ({
        url: `/api/v1/admin/products/variant`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ProductVariant", "Product"],
    }),

    updateProductVariant: builder.mutation<
      IResponseProductVariant,
      { variantId: string; updatedVariant: Partial<FormData> }
    >({
      query: ({ variantId, updatedVariant }) => {
        return {
          url: `/api/v1/admin/products/variant/${variantId}`,
          method: "PUT",
          body: updatedVariant,
        };
      },
      invalidatesTags: ["ProductVariant", "Product"],
    }),

    deleteProductVariant: builder.mutation<{ message: string }, { id: string }>(
      {
        query: ({ id }) => ({
          url: `/api/v1/admin/products/variant/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["ProductVariant", "Product"],
      }
    ),
  }),
});

export const {
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useGetDetailsVariantQuery,
} = productVariantApi;

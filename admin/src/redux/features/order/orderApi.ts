import { baseApi } from "../../api/baseApi";
import type {
  IResponseDetailOrder,
  IResponseOrderSingle,
  IResponseOrderList,
} from "../../../types/order";

export const orderApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOrders: builder.query<IResponseOrderList, void>({
      query: () => ({
        url: `/api/v1/admin/orders/`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    getOrderDetails: builder.query<IResponseDetailOrder, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation<
      IResponseOrderSingle,
      { id: string; status: string }
    >({
      query: ({ id, status }) => {
        return {
          url: `/api/v1/admin/orders/${id}`,
          method: "PUT",
          body: { status },
        };
      },
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrderDetailsQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;

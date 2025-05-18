import { baseApi } from "../../api/baseApi";
import { IResponseCustomer, Customer } from "../../../types/user";

interface IResponseCustomerDetail {
  message: string;
  customer: Customer;
}

export const orderApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUsers: builder.query<IResponseCustomer, void>({
      query: () => ({
        url: `/api/v1/admin/users/`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getDetailsUser: builder.query<IResponseCustomerDetail, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/users/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetDetailsUserQuery, useGetUsersQuery } = orderApi;

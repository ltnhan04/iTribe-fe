import { baseApi } from "../../api/baseApi";
import { IResponseRevenue } from "../../../types/revenue";

export const revenueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRevenueOfDateByRange: builder.query<
      IResponseRevenue,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: `/api/v1/admin/revenue/custom?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      providesTags: ["Revenue"],
    }),
    getRevenueByMonth: builder.query<
      IResponseRevenue,
      { year: number; month: number }
    >({
      query: ({ year, month }) => ({
        url: `/api/v1/admin/revenue/month?year=${year}&month=${month}`,
        method: "GET",
      }),
      providesTags: ["Revenue"],
    }),
    getRevenueByYear: builder.query<IResponseRevenue, { year: number }>({
      query: ({ year }) => ({
        url: `/api/v1/admin/revenue/year?year=${year}`,
        method: "GET",
      }),
      providesTags: ["Revenue"],
    }),
  }),
});

export const {
  useGetRevenueOfDateByRangeQuery,
  useGetRevenueByMonthQuery,
  useGetRevenueByYearQuery,
} = revenueApi;

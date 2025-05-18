import { Spin } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "../../../utils/format-currency";
import { IResponseRevenue } from "../../../types/revenue";

interface YearlyChartProps {
  data: IResponseRevenue | undefined;
  isLoading: boolean;
}

export const YearlyChart = ({ data, isLoading }: YearlyChartProps) => {
  return (
    <Spin spinning={isLoading}>
      <LineChart
        width={1200}
        height={400}
        data={data?.data.report}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Revenue"]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalSales"
          stroke="#8884d8"
          name="Revenue"
          dot={false}
        />
      </LineChart>
    </Spin>
  );
};

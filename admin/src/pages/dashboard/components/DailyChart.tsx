import { Row, Col, Spin, DatePicker } from "antd";
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
import dayjs from "dayjs";
import { IResponseRevenue } from "../../../types/revenue";

const { RangePicker } = DatePicker;

interface DailyChartProps {
  data: IResponseRevenue | undefined;
  isLoading: boolean;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  onDateRangeChange: (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
}

export const DailyChart = ({
  data,
  isLoading,
  dateRange,
  onDateRangeChange,
}: DailyChartProps) => {
  return (
    <>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <RangePicker
            value={dateRange}
            onChange={(dates) =>
              onDateRangeChange(dates as [dayjs.Dayjs, dayjs.Dayjs])
            }
            style={{ width: 300 }}
          />
        </Col>
      </Row>
      <Spin spinning={isLoading}>
        <LineChart
          width={1200}
          height={400}
          data={data?.data.report}
          margin={{ top: 5, right: 50, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            height={60}
            angle={-45}
            textAnchor="end"
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Revenue"]}
            labelFormatter={(label) => label}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="natural"
            dataKey="totalSales"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Revenue"
          />
        </LineChart>
      </Spin>
    </>
  );
};

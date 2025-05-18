import { Row, Col, Spin, Select } from "antd";
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

const { Option } = Select;

interface MonthlyChartProps {
  data: IResponseRevenue | undefined;
  isLoading: boolean;
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

export const MonthlyChart = ({
  data,
  isLoading,
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
}: MonthlyChartProps) => {
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i, 1).toLocaleString("default", { month: "long" }),
  }));

  return (
    <>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Select
            value={selectedYear}
            onChange={onYearChange}
            style={{ width: 120, marginRight: 8 }}
          >
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          <Select
            value={selectedMonth}
            onChange={onMonthChange}
            style={{ width: 120 }}
          >
            {months.map(({ value, label }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
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
    </>
  );
};

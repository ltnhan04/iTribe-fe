import { Row, Col, Statistic, Card } from "antd";
import { formatCurrency } from "../../../utils/format-currency";
import { IResponseRevenue } from "../../../types/revenue";

interface SummaryStatsProps {
  data: IResponseRevenue | undefined;
}

export const SummaryStats = ({ data }: SummaryStatsProps) => {
  const summary = data?.data.summary;

  const totalSales = summary?.totalSales
    ? typeof summary.totalSales === "string"
      ? Number(summary.totalSales.replace(/[^0-9.-]+/g, ""))
      : Number(summary.totalSales)
    : 0;
  const totalOrders = summary?.totalOrders
    ? typeof summary.totalOrders === "string"
      ? Number(String(summary.totalOrders).replace(/[^0-9.-]+/g, ""))
      : Number(summary.totalOrders)
    : 0;
  const averageOrderValue = summary?.averageOrderValue
    ? typeof summary.averageOrderValue === "string"
      ? Number(String(summary.averageOrderValue).replace(/[^0-9.-]+/g, ""))
      : Number(summary.averageOrderValue)
    : 0;

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Revenue"
            value={totalSales}
            formatter={(value) => formatCurrency(Number(value))}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Orders"
            value={totalOrders}
            formatter={(value) => Number(value).toLocaleString()}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Average Order Value"
            value={averageOrderValue}
            formatter={(value) => formatCurrency(Number(value))}
          />
        </Card>
      </Col>
    </Row>
  );
};

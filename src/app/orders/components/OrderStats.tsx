import { Order } from "@/types/order";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { COLORS } from "@/constants/page";

interface OrderStatsProps {
  orders: Order[];
}

const OrderStats = ({ orders }: OrderStatsProps) => {
  const statusCounts = orders.reduce((acc: Record<string, number>, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const data = [
    { name: "Chờ xử lý", value: statusCounts.pending || 0 },
    { name: "Đang giao", value: statusCounts.processing || 0 },
    { name: "Đã giao", value: statusCounts.delivered || 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-gray-600">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStats;

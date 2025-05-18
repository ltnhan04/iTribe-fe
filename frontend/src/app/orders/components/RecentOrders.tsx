import { Order } from "@/types/order";
import Image from "next/image";
import Link from "next/link";

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Đơn hàng gần đây
      </h3>
      <div className="space-y-4">
        {recentOrders.map((order) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className="block hover:bg-gray-50 rounded-lg p-3 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={order.variants[0]?.variant?.images[0] as string}
                  alt={
                    order.variants[0]?.variant?.color?.colorName || "Product"
                  }
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {order.variants[0]?.variant?.color?.colorName || "Sản phẩm"}
                </p>
                <p className="text-sm text-gray-500">
                  {order.variants.length} sản phẩm
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.totalAmount)}
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status === "delivered"
                    ? "Đã giao"
                    : order.status === "processing"
                    ? "Đang giao"
                    : "Chờ xử lý"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;

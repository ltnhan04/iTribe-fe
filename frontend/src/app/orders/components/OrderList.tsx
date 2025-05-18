import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import OrderTimeline from "./OrderTimeline";
import { Order } from "@/types/order";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
import { Button } from "@/components/ui/button";

interface OrderListProps {
  orders: Order[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  handleCancelOrder: (orderId: string) => void;
}

const noOrder = "/assets/images/no-order.jpg";

const OrderList = ({
  orders,
  activeFilter,
  setActiveFilter,
  handleCancelOrder,
}: OrderListProps) => {
  const [selectedVariant, setSelectedVariant] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  const handleOpenReviewModal = (variantId: string, productName: string) => {
    setSelectedVariant({ id: variantId, name: productName });
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedVariant(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Chi tiết đơn hàng
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "pending"
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Chờ xử lý
          </button>
          <button
            onClick={() => setActiveFilter("processing")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "processing"
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Đang giao
          </button>
          <button
            onClick={() => setActiveFilter("delivered")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "delivered"
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Đã giao
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-[200px] h-[200px] relative mb-6">
            <Image
              src={noOrder}
              alt="no order"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {activeFilter === "pending"
              ? "Không có đơn hàng đang chờ xử lý"
              : activeFilter === "processing"
              ? "Không có đơn hàng đang giao"
              : activeFilter === "delivered"
              ? "Không có đơn hàng đã giao"
              : "Không có đơn hàng nào"}
          </h3>
          <p className="text-gray-500 mt-2 text-center">
            {activeFilter === "pending"
              ? "Bạn chưa có đơn hàng nào đang chờ xử lý"
              : activeFilter === "processing"
              ? "Bạn chưa có đơn hàng nào đang trong quá trình giao hàng"
              : activeFilter === "delivered"
              ? "Bạn chưa có đơn hàng nào đã giao thành công"
              : "Bạn chưa có đơn hàng nào trong hệ thống"}
          </p>
          <button
            onClick={() => setActiveFilter("all")}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Xem tất cả đơn hàng
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredOrders.map((order) => (
            <Accordion key={order._id} type="single" collapsible>
              <AccordionItem value={order._id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order._id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ngày đặt:{" "}
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                          order.status === "delivered"
                            ? "bg-green-50 text-green-700"
                            : order.status === "processing"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {order.status === "delivered"
                          ? "Đã giao"
                          : order.status === "processing"
                          ? "Đang giao"
                          : "Chờ xử lý"}
                      </span>
                      {order.status === "pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order._id);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-4">
                    <div className="mb-8">
                      <OrderTimeline status={order.status} />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-base font-medium text-gray-900">
                        Sản phẩm
                      </h3>
                      <div className="space-y-4">
                        {order.variants.map((variant) => (
                          <div
                            key={variant._id}
                            className="flex items-center space-x-6 p-4 bg-gray-50 rounded-xl hover:shadow-sm transition-all duration-300"
                          >
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                              <Image
                                src={variant.variant?.images[0] as string}
                                alt={
                                  variant.variant?.color?.colorName || "Product"
                                }
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-base font-medium text-gray-900">
                                {variant.variant?.color?.colorName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Số lượng: {variant.quantity}
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <p className="text-base font-semibold text-gray-900">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(variant.variant?.price || 0)}
                              </p>
                              {order.status === "delivered" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenReviewModal(
                                      variant.variant?._id || "",
                                      variant.variant?.color?.colorName || ""
                                    )
                                  }
                                >
                                  Đánh giá
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">
                            Phương thức thanh toán
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {order.paymentMethod}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Tổng tiền</p>
                          <p className="text-xl font-semibold text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      )}

      {selectedVariant && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          variantId={selectedVariant.id}
          productName={selectedVariant.name}
        />
      )}
    </div>
  );
};

export default OrderList;

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import withAuth from "@/components/common/withAuth";

import { useOrders } from "@/hooks/useOrders";
import OrderStats from "./components/OrderStats";
import RecentOrders from "./components/RecentOrders";
import OrderList from "./components/OrderList";

const noOrder = "/assets/images/no-order.jpg";

const OrderTracker = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { orders: ordersData, isLoading, error, cancelOrder } = useOrders();
  const orders = ordersData?.orders || [];

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast({
        title: "Đã hủy đơn hàng thành công",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Không thể hủy đơn hàng",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <div className="h-96 bg-white rounded-lg shadow-sm"></div>
              </div>
              <div className="col-span-4">
                <div className="h-96 bg-white rounded-lg shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Đã xảy ra lỗi khi tải đơn hàng</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-[300px] h-[300px] relative">
              <Image
                src={noOrder}
                alt="no order"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mt-6">
              Không có đơn hàng nào
            </h2>
            <p className="text-gray-500 mt-2">
              Bạn chưa có đơn hàng nào trong hệ thống
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Theo dõi đơn hàng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý và theo dõi trạng thái đơn hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Thống kê đơn hàng
              </h2>
              <OrderStats orders={orders || []} />
            </div>

            <OrderList
              orders={orders}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              handleCancelOrder={handleCancelOrder}
            />
          </div>

          <div className="col-span-4">
            <div className="sticky top-6">
              <RecentOrders orders={orders || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(OrderTracker);

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { message, Drawer } from "antd";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderDetailsQuery,
} from "../../redux/features/order/orderApi";
import { OrderList } from "../../types/order";
import Loading from "../../loading";
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import OrderDetails from "./components/OrderDetails";

const OrderPage: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);

  const { data: ordersData, isLoading } = useGetOrdersQuery();
  const { data: orderDetails, isLoading: isLoadingDetails } =
    useGetOrderDetailsQuery(
      { id: selectedOrderId || "" },
      { skip: !selectedOrderId }
    );
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      message.success("Order status updated successfully");
    } catch (error) {
      message.error("Failed to update order status");
    }
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsDrawerVisible(true);
  };

  const filteredOrders = ordersData?.data?.filter((order: OrderList) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchText.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = !statusFilter || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <OrderFilters
        searchText={searchText}
        statusFilter={statusFilter}
        onSearchChange={setSearchText}
        onStatusFilterChange={setStatusFilter}
      />

      <OrderTable
        orders={filteredOrders || []}
        onStatusChange={handleUpdateStatus}
        onViewDetails={handleViewDetails}
      />

      <Drawer
        title="Order Details"
        placement="right"
        onClose={() => {
          setIsDetailsDrawerVisible(false);
          setSelectedOrderId(null);
        }}
        open={isDetailsDrawerVisible}
        width={800}
      >
        {isLoadingDetails ? (
          <Loading />
        ) : (
          orderDetails?.data && <OrderDetails order={orderDetails.data} />
        )}
      </Drawer>
    </div>
  );
};

export default OrderPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table, Select, Space, Tag } from "antd";
import { OrderList } from "../../../types/order";
import { formatCurrency } from "../../../utils/format-currency";

const { Option } = Select;

interface OrderTableProps {
  orders: OrderList[];
  onStatusChange: (orderId: string, newStatus: string) => void;
  onViewDetails: (orderId: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onStatusChange,
  onViewDetails,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "processing";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "cancel":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Customer",
      key: "user",
      render: (record: OrderList) => (
        <div>
          <div>{record.user.name}</div>
          <div>{record.user.email}</div>
        </div>
      ),
    },
    {
      title: "Products",
      key: "variants",
      render: (record: OrderList) => (
        <div>
          {record.variants.map((item) => (
            <div key={item._id}>
              {item.variant?.storage} - {item.variant?.color.colorName} x{" "}
              {item.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: OrderList) => (
        <Space>
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          <Select
            value={status}
            style={{ width: 120 }}
            onChange={(value) => onStatusChange(record._id, value)}
          >
            <Option value="pending">PENDING</Option>
            <Option value="processing">PROCESSING</Option>
            <Option value="shipped">SHIPPED</Option>
            <Option value="delivered">DELIVERED</Option>
            <Option value="cancel">CANCEL</Option>
          </Select>
        </Space>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) => (
        <Tag color="blue">{method.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: OrderList) => (
        <Space>
          <a onClick={() => onViewDetails(record._id)}>View Details</a>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="_id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} orders`,
      }}
    />
  );
};

export default OrderTable;

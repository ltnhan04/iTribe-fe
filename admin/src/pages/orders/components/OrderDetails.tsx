import React from "react";
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Image,
  Carousel,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { OrderList, Variant1 } from "../../../types/order";
import { formatCurrency } from "../../../utils/format-currency";

const { Title, Text } = Typography;

interface OrderDetailsProps {
  order: OrderList;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "shipped":
        return "cyan";
      case "delivered":
        return "green";
      case "cancel":
        return "red";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Variant1> = [
    {
      title: "Storage",
      dataIndex: ["variant", "storage"],
      key: "storage",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Color",
      dataIndex: ["variant", "color", "colorName"],
      key: "color",
      render: (color: string) => <Tag color="blue">{color}</Tag>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => <Text>{quantity}</Text>,
    },
    {
      title: "Images",
      key: "images",
      render: (_, record) => (
        <div style={{ width: 100 }}>
          <Carousel autoplay>
            {record.variant?.images.map((image: string, index: number) => (
              <div key={index}>
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={80}
                  height={80}
                  preview={true}
                  style={{ borderRadius: 4 }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <Card
        title={<Title level={3}>Order Information</Title>}
        className="bg-white rounded-lg shadow"
        bordered={false}
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label={<Text strong>Order ID</Text>}>
            <Text copyable>{order._id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Status</Text>}>
            <Tag color={getStatusColor(order.status)}>
              {order.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Total Amount</Text>}>
            <Text strong type="success">
              {formatCurrency(order.totalAmount)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Payment Method</Text>}>
            <Tag color="blue">{order.paymentMethod.toUpperCase()}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Shipping Address</Text>}>
            {order.shippingAddress}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Created At</Text>}>
            {new Date(order.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Updated At</Text>}>
            {new Date(order.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={<Title level={3}>Customer Information</Title>}
        className="bg-white rounded-lg shadow"
        bordered={false}
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label={<Text strong>Name</Text>}>
            {order.user.name}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Email</Text>}>
            {order.user.email}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={<Title level={3}>Order Items</Title>}
        className="bg-white rounded-lg shadow"
        bordered={false}
      >
        <Table
          columns={columns}
          dataSource={order.variants}
          rowKey="_id"
          pagination={false}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default OrderDetails;

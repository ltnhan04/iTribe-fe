import React from "react";
import { Table, Button, Space, Tag } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { IProduct } from "../../../types/product";
import type { ColumnsType } from "antd/es/table";

interface ProductTableProps {
  products: IProduct[];
  loading: boolean;
  onEdit: (record: IProduct) => void;
  onDelete: (id: string) => Promise<void>;
  onViewDetails: (record: IProduct) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const columns: ColumnsType<IProduct> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => (
        <div
          style={{
            maxHeight: "50px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          dangerouslySetInnerHTML={{ __html: text || "" }}
        />
      ),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text: string) => (text ? <Tag color="blue">{text}</Tag> : "-"),
      filters: [
        ...new Set(products.map((p) => p.category?.name || "").filter(Boolean)),
      ].map((catName) => ({
        text: catName,
        value: catName,
      })),
      onFilter: (value, record) => record.category?.name === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => onViewDetails(record)}>
            View
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="_id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
};

export default ProductTable;

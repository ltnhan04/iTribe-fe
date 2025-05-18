/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Form, Input, Select, Space, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { Category } from "../../../types/category";

interface ProductFiltersProps {
  onFilter: (values: any) => void;
  onReset: () => void;
  categories: Category[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilter,
  onReset,
  categories,
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFilter}
      style={{ marginBottom: 24 }}
    >
      <Form.Item name="search">
        <Input
          placeholder="Search by name"
          prefix={<SearchOutlined />}
          allowClear
        />
      </Form.Item>

      <Form.Item name="category">
        <Select
          placeholder="Select category"
          allowClear
          style={{ width: 200 }}
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat.name,
          }))}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProductFilters;

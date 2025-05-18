import React from "react";
import { Card, Row, Col, Form, Select, InputNumber, Input } from "antd";
import { VariantFilters as VariantFiltersType } from "../../../types/product";

interface VariantFiltersProps {
  filters: VariantFiltersType;
  onFilterChange: (filters: VariantFiltersType) => void;
}

const VariantFilters: React.FC<VariantFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <Card className="mb-4">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item>
            <Input
              placeholder="Search by storage"
              value={filters.storage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFilterChange({
                  ...filters,
                  storage: e.target.value,
                })
              }
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item>
            <InputNumber
              placeholder="Max price"
              value={filters.price}
              onChange={(value) => onFilterChange({ ...filters, price: value })}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item>
            <InputNumber
              placeholder="Max stock"
              value={filters.stock}
              onChange={(value) => onFilterChange({ ...filters, stock: value })}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item>
            <Select
              allowClear
              placeholder="Select status"
              value={filters.status}
              onChange={(value) =>
                onFilterChange({
                  ...filters,
                  status: value as "in_stock" | "out_of_stock" | null,
                })
              }
            >
              <Select.Option value="in_stock">In Stock</Select.Option>
              <Select.Option value="out_of_stock">Out of Stock</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default VariantFilters;

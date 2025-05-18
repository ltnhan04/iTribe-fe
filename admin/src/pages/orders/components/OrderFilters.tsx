import React from "react";
import { Card, Row, Col, Input, Select } from "antd";

const { Search } = Input;
const { Option } = Select;

interface OrderFiltersProps {
  searchText: string;
  statusFilter: string | null;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string | null) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}) => {
  return (
    <Card className="mb-4">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Search
            placeholder="Search by ID, name or email"
            allowClear
            enterButton
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={onStatusFilterChange}
          >
            <Option value="pending">PENDING</Option>
            <Option value="processing">PROCESSING</Option>
            <Option value="shipped">SHIPPED</Option>
            <Option value="delivered">DELIVERED</Option>
            <Option value="cancel">CANCEL</Option>
          </Select>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderFilters; 
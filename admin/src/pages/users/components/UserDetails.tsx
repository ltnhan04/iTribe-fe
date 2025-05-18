import React from "react";
import { Card, Descriptions, Typography } from "antd";
import { Customer } from "../../../types/user";

const { Title, Text } = Typography;

interface UserDetailsProps {
  user: Customer;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className="space-y-6 p-4">
      <Card
        title={<Title level={3}>User Information</Title>}
        className="bg-white rounded-lg shadow"
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label={<Text strong>User ID</Text>}>
            <Text copyable>{user._id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Name</Text>}>
            <Text strong>{user.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Email</Text>}>
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Role</Text>}>
            <Text>{user.role.toUpperCase()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Created At</Text>}>
            {new Date(user.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Updated At</Text>}>
            {new Date(user.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserDetails;

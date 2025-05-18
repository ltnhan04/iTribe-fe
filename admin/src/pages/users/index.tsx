import React, { useState } from "react";
import { Drawer, Card, Table, Tag, Typography, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useGetUsersQuery,
  useGetDetailsUserQuery,
} from "../../redux/features/users/userApi";
import { Customer } from "../../types/user";
import Loading from "../../loading";
import UserDetails from "./components/UserDetails";

const { Title, Text } = Typography;

const UserPage: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);

  const { data: usersData, isLoading } = useGetUsersQuery();
  const { data: userDetails, isLoading: isLoadingDetails } =
    useGetDetailsUserQuery(
      { id: selectedUserId || "" },
      { skip: !selectedUserId }
    );

  const handleViewDetails = (userId: string) => {
    console.log("Viewing details for user:", userId);
    setSelectedUserId(userId);
    setIsDetailsDrawerVisible(true);
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "User ID",
      dataIndex: "_id",
      key: "_id",
      render: (text: string) => <Text copyable>{text}</Text>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role.toUpperCase()}
        </Tag>
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
      render: (_, record) => (
        <Space>
          <a onClick={() => handleViewDetails(record._id)}>View Details</a>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Card
        title={<Title level={3}>User Management</Title>}
        className="bg-white rounded-lg shadow"
        variant="outlined"
      >
        <Table
          columns={columns}
          dataSource={usersData?.data}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </Card>

      <Drawer
        title="User Details"
        placement="right"
        onClose={() => {
          setIsDetailsDrawerVisible(false);
          setSelectedUserId(null);
        }}
        open={isDetailsDrawerVisible}
        width={800}
      >
        {isLoadingDetails ? (
          <Loading />
        ) : userDetails?.customer ? (
          <UserDetails user={userDetails.customer} />
        ) : (
          <Text>No user details available</Text>
        )}
      </Drawer>
    </div>
  );
};

export default UserPage;

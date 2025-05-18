import React from "react";
import { List, Avatar, Typography, Space, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Conversation } from "../../../types/inbox";
const { Text } = Typography;

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: number;
  onSelect: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
}) => {
  const getLastMessage = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return "No messages yet";
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.message;
  };

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter((msg) => !msg.is_reply).length;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <List
        className="conversation-list flex-1 overflow-y-auto"
        itemLayout="horizontal"
        dataSource={conversations}
        renderItem={(conversation) => (
          <List.Item
            className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
              selectedId === conversation.id
                ? "bg-gray-50 border-l-2 border-gray-800"
                : "border-l-2 border-transparent"
            }`}
            onClick={() => onSelect(conversation)}
          >
            <List.Item.Meta
              avatar={
                <Badge count={getUnreadCount(conversation)} color="#52525b">
                  <Avatar
                    size={48}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#52525b" }}
                  />
                </Badge>
              }
              title={
                <Space className="w-full">
                  <Text strong className="text-base text-gray-900">
                    {conversation.user.name}
                  </Text>
                  <Text type="secondary" className="text-sm">
                    ({conversation.user.email})
                  </Text>
                </Space>
              }
              description={
                <Space direction="vertical" size="small" className="w-full">
                  <Text ellipsis className="text-gray-600">
                    {getLastMessage(conversation)}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    {new Date(conversation.created_at).toLocaleString()}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ConversationList;

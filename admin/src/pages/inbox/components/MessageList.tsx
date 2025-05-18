import React, { useEffect, useRef } from "react";
import { List, Avatar, Typography, Space, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Message } from "../../../types/inbox";

const { Text } = Typography;

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto p-4 bg-white">
      <List
        className="message-list"
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={(message) => (
          <List.Item
            className={`${
              message.is_reply ? "justify-end" : "justify-start"
            } px-4 py-1`}
          >
            <div className="flex items-start space-x-2 max-w-[70%]">
              {!message.is_reply && (
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#52525b" }}
                />
              )}
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.is_reply
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-gray-50 text-gray-900 border border-gray-200"
                }`}
              >
                <Space direction="vertical" size="small">
                  {message.image && (
                    <Image
                      src={message.image}
                      alt="Message attachment"
                      width={200}
                      className="rounded-lg"
                    />
                  )}
                  <Text
                    className={`${
                      message.is_reply ? "text-white" : "text-gray-900"
                    } text-base`}
                  >
                    {message.message}
                  </Text>
                  <Text
                    className={`text-xs ${
                      message.is_reply ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleString()}
                  </Text>
                </Space>
              </div>
              {message.is_reply && (
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#52525b" }}
                />
              )}
            </div>
          </List.Item>
        )}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

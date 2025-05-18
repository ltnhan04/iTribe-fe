/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Input, Button, Upload, message } from "antd";
import { SendOutlined, PaperClipOutlined } from "@ant-design/icons";
import ConversationList from "./components/ConversationList";
import MessageList from "./components/MessageList";
import { Conversation, Message } from "../../types/inbox";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const InboxPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      user_id: 1,
      created_at: "2024-03-15T10:30:00Z",
      user: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      },
      messages: [
        {
          id: 1,
          conversation_id: 1,
          message: "Hello, I have a question about my order",
          is_reply: false,
          created_at: "2024-03-15T10:30:00Z",
        },
        {
          id: 2,
          conversation_id: 1,
          message: "Sure, how can I help you?",
          is_reply: true,
          created_at: "2024-03-15T10:31:00Z",
        },
      ],
    },
    {
      id: 2,
      user_id: 2,
      created_at: "2024-03-15T11:45:00Z",
      user: {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
      },
      messages: [
        {
          id: 3,
          conversation_id: 2,
          message: "I need help with my account",
          is_reply: false,
          created_at: "2024-03-15T11:45:00Z",
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      conversation_id: selectedConversation.id,
      message: newMessage,
      is_reply: true,
      created_at: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMsg] }
          : conv
      )
    );

    setNewMessage("");
    setFileList([]);
  };

  const handleFileUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Conversation List */}
      <div className="w-[360px] border-r border-gray-200">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={setSelectedConversation}
        />
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#52525b" }}
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {selectedConversation.user.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <MessageList messages={selectedConversation.messages} />

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <Upload
                  fileList={fileList}
                  onChange={handleFileUpload}
                  maxCount={1}
                >
                  <Button
                    icon={<PaperClipOutlined />}
                    className="text-gray-600 border-gray-300 hover:text-gray-800 hover:border-gray-400"
                  >
                    Attach
                  </Button>
                </Upload>
                <TextArea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className="border-gray-300 hover:border-gray-400 focus:border-gray-500"
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  style={{ backgroundColor: "#52525b" }}
                  className="hover:bg-gray-700"
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg text-gray-500">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;

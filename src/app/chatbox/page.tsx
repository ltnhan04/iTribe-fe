"use client"
import { useState, useEffect, useCallback } from "react";
import { message, Spin, Input, Button, Card, Layout, Space, Typography, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/lib/hooks";
import { jwtDecode } from "jwt-decode";
import { sendMessageSocket, onNewMessage, offNewMessage, sendMessageApi, getMessages } from "../../api/services/chatApi/chatApi"; 
import { Message } from "postcss";
const { Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const UserPage = () => {
  const [newMessage, setNewMessage] = useState<string>(""); 
  const [messages, setMessages] = useState<Message[]>([]); 
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false); 
  const { name: userName, accessToken } = useAppSelector((state) => state.auth);

  const decodeToken = (accessToken: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(accessToken);
      return decoded.userId;
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  };

  const userId = accessToken ? decodeToken(accessToken) : null;

  // Fetch messages when component mounts
  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const fetchedMessages = await getMessages(); 
      const sortedMessages = fetchedMessages.sort((a: Message, b: Message) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setMessages(sortedMessages); 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Failed to load messages!");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const messageListener = (messageData: Message) => {
      if (messageData.sender !== "user") {
        setMessages((prevMessages) => {
          if (!prevMessages.find(msg => msg.timestamp === messageData.timestamp)) {
            return [...prevMessages, messageData]; 
          }
          return prevMessages; 
        });
      }
    };
    onNewMessage(messageListener);
    return () => {
      offNewMessage(messageListener);
    };
  }, [userName, fetchMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && userId) {
      // Send message via WebSocket
      sendMessageSocket({ user: userName, message: newMessage });
      try {
        // Send message via API
        await sendMessageApi(userId, newMessage);
        // Update the messages list immediately without reloading
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "user", message: newMessage, timestamp: new Date().toISOString() } as unknown as Message,
        ]);
        setNewMessage(""); 
        message.success("Message sent successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        message.error("Failed to send message, please try again!");
      }
    }
  };

  return (
    <Layout style={{ height: "100vh", background: "linear-gradient(to bottom right, #f0f4f8, #d1e8e2)", padding: "24px" }}>
      <Content style={{ width: "100%", padding: "24px", borderRadius: "16px", backgroundColor: "#fff", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Title level={3} style={{ textAlign: "center", color: "#1890ff" }}>
            User Chat - {userName}
          </Title>

          {loadingMessages ? (
            <Spin size="large" style={{ display: "block", margin: "auto" }} />
          ) : (
            <Card style={{ height: "calc(100vh - 320px)", overflowY: "auto", padding: "16px", backgroundColor: "#fafafa", borderRadius: "16px", border: "1px solid #e6e6e6" }}>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", alignItems: "center", marginBottom: "12px" }}>
                    {msg.sender !== "user" && <Avatar icon={<UserOutlined />} style={{ marginRight: "8px", backgroundColor: "#87d068" }} />}
                    <div style={{
                      background: msg.sender === "user" ? "linear-gradient(135deg, #1890ff, #40a9ff)" : "#f0f0f0",
                      color: msg.sender === "user" ? "#fff" : "#000",
                      padding: "12px 16px",
                      borderRadius: msg.sender === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}>
                      <Typography.Text style={{ fontWeight: "bold", color: msg.sender === "user" ? "#fff" : "#1890ff" }}>
                        {msg.sender === "user" ? "You" : "Admin"}
                      </Typography.Text>
                      <div>{msg.message}</div>
                    </div>
                  </div>
                ))
              ) : (
                <Typography.Text type="secondary">No messages yet.</Typography.Text>
              )}
            </Card>
          )}

          <TextArea
            rows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{ resize: "none", borderRadius: "8px", marginBottom: "16px" }}
          />
          <Button
            type="primary"
            onClick={handleSendMessage}
            block
            style={{ borderRadius: "8px", background: "#1890ff", borderColor: "#1890ff", fontWeight: "bold" }}
          >
            Send Message
          </Button>
        </Space>
      </Content>
    </Layout>
  );
};

export default UserPage;

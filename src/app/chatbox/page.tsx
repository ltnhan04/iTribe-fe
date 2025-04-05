"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/hooks";
import { jwtDecode } from "jwt-decode";
import { Loader2, MessageCircle, Send } from "lucide-react";
import {
  createChatSession,
  sendMessage,
  getChatHistory,
  Message,
} from "@/services/chatbot/chatbotApi";

const UserPage = () => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");
  const { name: userName, accessToken } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  const decodeToken = (accessToken: string) => {
    try {
      const decoded: any = jwtDecode(accessToken);
      return decoded.userId;
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  };

  const userId = accessToken ? decodeToken(accessToken) : null;

  const fetchMessages = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const response = await getChatHistory(sessionId);
      if (response.status === "success") {
        setMessages(response.data.messages);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải tin nhắn. Vui lòng thử lại!",
        variant: "destructive",
      });
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, toast]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const response = await createChatSession();
        if (response.status === "success") {
          setSessionId(response.data.sessionId);
          // Gửi tin nhắn chào mừng
          await sendMessage(response.data.sessionId, "Hello");
          fetchMessages();
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể khởi tạo phiên chat. Vui lòng thử lại!",
          variant: "destructive",
        });
      }
    };

    if (userId && !sessionId) {
      initChat();
    }
  }, [userId, sessionId, fetchMessages, toast]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && sessionId) {
      try {
        setIsLoading(true);
        const response = await sendMessage(sessionId, newMessage.trim());
        if (response.status === "success") {
          setNewMessage("");
          await fetchMessages();
          toast({
            title: "Thành công",
            description: "Đã gửi tin nhắn!",
            variant: "default",
          });
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể gửi tin nhắn. Vui lòng thử lại!",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-primary flex items-center justify-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Hộp thoại chat - {userName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-400px)] pr-4">
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">
                          {msg.role === "user" ? "Bạn" : "Bot"}
                        </p>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    Chưa có tin nhắn nào.
                  </p>
                )}
              </div>
            </ScrollArea>
          )}

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Nhập tin nhắn..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;

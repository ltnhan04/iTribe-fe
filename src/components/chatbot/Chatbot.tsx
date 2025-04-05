import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageCircle, Send, Bot } from "lucide-react";
import {
  createChatSession,
  sendMessage,
  getChatHistory,
  Message,
} from "@/services/chatbot/chatbotApi";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

  const initChat = async () => {
    try {
      setIsLoading(true);
      const response = await createChatSession();
      if (response.status === "success") {
        setSessionId(response.data.sessionId);
        // Gửi tin nhắn chào mừng và lấy response
        const welcomeResponse = await sendMessage(response.data.sessionId, "Hello");
        if (welcomeResponse.status === "success") {
          // Thêm tin nhắn của người dùng
          setMessages(prev => [...prev, {
            _id: Date.now().toString(),
            role: "user",
            content: "Hello",
            timestamp: new Date().toISOString()
          }]);
          // Thêm tin nhắn của bot
          setMessages(prev => [...prev, {
            _id: (Date.now() + 1).toString(),
            role: "assistant",
            content: welcomeResponse.data.response,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể khởi tạo phiên chat. Vui lòng thử lại!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !sessionId) return;

    try {
      setIsLoading(true);
      const trimmedMessage = newMessage.trim();
      setNewMessage("");

      // Thêm tin nhắn của người dùng vào state
      setMessages(prev => [...prev, {
        _id: Date.now().toString(),
        role: "user",
        content: trimmedMessage,
        timestamp: new Date().toISOString()
      }]);

      const response = await sendMessage(sessionId, trimmedMessage);
      if (response.status === "success") {
        // Thêm tin nhắn của bot vào state
        setMessages(prev => [...prev, {
          _id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.response,
          timestamp: new Date().toISOString()
        }]);
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true);
          if (!sessionId) {
            initChat();
          }
        }}
        className="fixed bottom-4 right-4 rounded-full p-4"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[350px] h-[500px] flex flex-col shadow-xl">
      {/* Header */}
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">iTribe Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full"
          >
            ✕
          </Button>
        </div>
      </CardHeader>

      {/* Chat Area */}
      <CardContent className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        {sessionId ? (
          <>
            <ScrollArea className="flex-1 pr-4" style={{ height: "calc(100% - 60px)" }}>
              <div className="space-y-4">
                {messages.map((msg) => (
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
                      <p className="whitespace-pre-line text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Button onClick={initChat} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Bắt đầu trò chuyện
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
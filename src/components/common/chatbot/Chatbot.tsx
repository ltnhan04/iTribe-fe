/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useCallback, useRef, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageCircle, Send, Bot, X } from "lucide-react";
import {
  createChatSession,
  sendMessage,
  getChatHistory,
  Message,
} from "@/services/chatbot/chatbotApi";

import { ErrorType } from "@/types/common";

interface ChatState {
  isOpen: boolean;
  sessionId: string;
  messages: Message[];
  newMessage: string;
  isLoading: boolean;
  isTyping: boolean;
}

type ChatAction =
  | { type: "OPEN_CHAT" }
  | { type: "CLOSE_CHAT" }
  | { type: "SET_SESSION_ID"; payload: string }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_NEW_MESSAGE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TYPING"; payload: boolean };

const initialState: ChatState = {
  isOpen: false,
  sessionId: "",
  messages: [],
  newMessage: "",
  isLoading: false,
  isTyping: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "OPEN_CHAT":
      return { ...state, isOpen: true };
    case "CLOSE_CHAT":
      return { ...state, isOpen: false };
    case "SET_SESSION_ID":
      return { ...state, sessionId: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_NEW_MESSAGE":
      return { ...state, newMessage: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_TYPING":
      return { ...state, isTyping: action.payload };
    default:
      return state;
  }
}

export default function Chatbot() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  useEffect(() => {
    if (state.isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isOpen]);

  const fetchMessages = useCallback(async () => {
    if (!state.sessionId) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await getChatHistory(state.sessionId);
      if (response.status === "success") {
        dispatch({ type: "SET_MESSAGES", payload: response.data.messages });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải tin nhắn. Vui lòng thử lại!",
        variant: "destructive",
      });
      dispatch({ type: "SET_MESSAGES", payload: [] });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.sessionId, toast]);

  const initChat = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await createChatSession();
      if (response.status === "success") {
        dispatch({ type: "SET_SESSION_ID", payload: response.data.sessionId });
        await fetchMessages();
        const welcomeResponse = await sendMessage(
          response.data.sessionId,
          "Hello"
        );
        if (welcomeResponse.status === "success") {
          dispatch({
            type: "ADD_MESSAGE",
            payload: {
              _id: Date.now().toString(),
              role: "user",
              content: "Hello",
              timestamp: new Date().toISOString(),
            },
          });
          dispatch({
            type: "ADD_MESSAGE",
            payload: {
              _id: (Date.now() + 1).toString(),
              role: "assistant",
              content: welcomeResponse.data.response,
              timestamp: new Date().toISOString(),
            },
          });
        }
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể khởi tạo phiên chat. Vui lòng thử lại!",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSendMessage = async () => {
    if (!state.newMessage.trim() || !state.sessionId) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const trimmedMessage = state.newMessage.trim();
      dispatch({ type: "SET_NEW_MESSAGE", payload: "" });

      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          _id: Date.now().toString(),
          role: "user",
          content: trimmedMessage,
          timestamp: new Date().toISOString(),
        },
      });

      dispatch({ type: "SET_TYPING", payload: true });
      const response = await sendMessage(state.sessionId, trimmedMessage);
      dispatch({ type: "SET_TYPING", payload: false });

      if (response.status === "success") {
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            _id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response.data.response,
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          (error as ErrorType).response.data.message ||
          "Không thể gửi tin nhắn. Vui lòng thử lại!",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!state.isOpen) {
    return (
      <Button
        onClick={() => {
          dispatch({ type: "OPEN_CHAT" });
          if (!state.sessionId) {
            initChat();
          } else {
            fetchMessages();
          }
        }}
        className="fixed bottom-4 right-4 rounded-full p-4 border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-all duration-300 z-[9999]"
      >
        <MessageCircle className="h-6 w-6 text-gray-700" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[350px] h-[500px] flex flex-col bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl transition-all duration-300 z-[9999]">
      <CardHeader className="border-b border-gray-200/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-gray-700" />
            <CardTitle className="text-lg font-medium text-gray-700">
              Trợ lý ảo iTribe
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: "CLOSE_CHAT" })}
            className="h-8 w-8 rounded-full hover:bg-gray-100/50"
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        {state.sessionId ? (
          <>
            <ScrollArea
              className="flex-1 pr-4"
              style={{ height: "calc(100% - 60px)" }}
            >
              <div className="space-y-4">
                {state.messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100/50 text-gray-700"
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
                {state.isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100/50 text-gray-700 rounded-2xl p-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-2">
              <Input
                ref={inputRef}
                value={state.newMessage}
                onChange={(e) =>
                  dispatch({ type: "SET_NEW_MESSAGE", payload: e.target.value })
                }
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                disabled={state.isLoading}
                className="flex-1 bg-white/50 border-gray-200/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={state.isLoading || !state.newMessage.trim()}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {state.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Button
              onClick={initChat}
              disabled={state.isLoading}
              className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {state.isLoading ? (
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

import { axiosInstance } from "@/config/axiosInstance";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  _id: string;
}

export interface ChatHistory {
  messages: Message[];
}

export const createChatSession = async () => {
  const response = await axiosInstance.post("/api/v1/chatbot/session");
  return response.data;
};

export const sendMessage = async (sessionId: string, message: string) => {
  const response = await axiosInstance.post("/api/v1/chatbot/message", {
    sessionId,
    message,
  });
  return response.data;
};

export const getChatHistory = async (sessionId: string) => {
  const response = await axiosInstance.get(`/api/v1/chatbot/history/${sessionId}`);
  return response.data;
}; 
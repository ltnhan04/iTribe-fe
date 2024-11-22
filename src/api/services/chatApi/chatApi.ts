import { axiosInstance } from "@/config/axiosInstance";
import { AxiosError } from "axios";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT as string, {
  transports: ["websocket"],
});

// Hàm xử lý lỗi API
const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    throw new Error(error.response?.data?.message || "API error occurred");
  } else if (error instanceof Error) {
    throw new Error(error.message || "Error occurred");
  } else {
    throw new Error("An unknown error occurred.");
  }
};

// Gửi tin nhắn từ người dùng qua API
export const sendMessageApi = async (userId: string, message: string) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chat/send`,
      { message, userId }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Lấy tin nhắn của người dùng từ API
export const getMessages = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chat/messages`
    );
    return Array.isArray(response.data.messages) ? response.data.messages : [];
  } catch (error) {
    handleApiError(error);
    return []; // Trả về mảng rỗng khi gặp lỗi
  }
};

// Gửi phản hồi từ admin qua API
export const sendAdminReply = async (userId: string, message: string) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chat/admin/reply`,
      { userId, message }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Gửi tin nhắn qua WebSocket (Socket.IO)
export const sendMessageSocket = (message: { user: string; message: string }) => {
  socket.emit("sendMessage", message);
};

// Đăng ký sự kiện nhận tin nhắn mới từ WebSocket
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onNewMessage = (callback: (message: any) => void) => {
  socket.on("newMessage", callback);
};

// Hủy đăng ký sự kiện nhận tin nhắn mới từ WebSocket
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const offNewMessage = (callback: (message: any) => void) => {
  socket.off("newMessage", callback);
};

export default socket;

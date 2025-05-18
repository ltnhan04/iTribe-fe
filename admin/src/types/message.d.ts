export interface Message {
  user: string;
  name: string;
  message: string;
  timestamp: string;
  sender: "user" | "admin";
}

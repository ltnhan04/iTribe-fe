export interface Message {
  id: number;
  conversation_id: number;
  message: string;
  is_reply: boolean;
  image?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  created_at: string;
  messages: Message[];
  user: {
    id: number;
    name: string;
    email: string;
  };
}

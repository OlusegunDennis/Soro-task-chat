export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  joinedAt: Date;
}

export interface Chat {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface TypingUser {
  userId: string;
  username: string;
  chatId: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
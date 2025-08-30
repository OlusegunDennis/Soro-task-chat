import { create } from 'zustand';
import { Chat, Message, TypingUser } from '../types';

interface ChatStore {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChat: string | null;
  typingUsers: TypingUser[];
  
  // Actions
  createChat: (name: string, userId: string) => string | null;
  sendMessage: (chatId: string, content: string, senderId: string) => void;
  setActiveChat: (chatId: string) => void;
  loadChats: (userId: string) => void;
  setTyping: (chatId: string, userId: string, username: string, isTyping: boolean) => void;
  deleteChat: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: {},
  activeChat: null,
  typingUsers: [],

  createChat: (name: string, userId: string) => {
    const { chats } = get();
    
    // Check if user has reached the limit (2 chats for free users)
    const userChats = chats.filter(chat => chat.participants.includes(userId));
    
    const chatId = Date.now().toString();
    const newChat: Chat = {
      id: chatId,
      name,
      participants: [userId],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedChats = [...chats, newChat];
    
    set({ 
      chats: updatedChats,
      messages: { ...get().messages, [chatId]: [] }
    });
    
    // Save to localStorage
    localStorage.setItem('chat-app-chats', JSON.stringify(updatedChats));
    localStorage.setItem('chat-app-messages', JSON.stringify({ ...get().messages, [chatId]: [] }));
    
    return chatId;
  },

  sendMessage: (chatId: string, content: string, senderId: string) => {
    const { messages, chats } = get();
    
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      senderId,
      content,
      timestamp: new Date(),
    };

    const updatedMessages = {
      ...messages,
      [chatId]: [...(messages[chatId] || []), newMessage],
    };

    // Update chat's last message and timestamp
    const updatedChats = chats.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
        : chat
    );

    set({ 
      messages: updatedMessages,
      chats: updatedChats
    });

    // Save to localStorage
    localStorage.setItem('chat-app-messages', JSON.stringify(updatedMessages));
    localStorage.setItem('chat-app-chats', JSON.stringify(updatedChats));
  },

  setActiveChat: (chatId: string) => {
    set({ activeChat: chatId });
  },

  loadChats: (userId: string) => {
    // Load from localStorage
    const savedChats = localStorage.getItem('chat-app-chats');
    const savedMessages = localStorage.getItem('chat-app-messages');
    
    if (savedChats) {
      const chats = JSON.parse(savedChats).filter((chat: Chat) => 
        chat.participants.includes(userId)
      );
      set({ chats });
    }
    
    if (savedMessages) {
      set({ messages: JSON.parse(savedMessages) });
    }
  },

  setTyping: (chatId: string, userId: string, username: string, isTyping: boolean) => {
    const { typingUsers } = get();
    
    if (isTyping) {
      // Add user to typing list if not already there
      const existing = typingUsers.find(user => user.userId === userId && user.chatId === chatId);
      if (!existing) {
        set({ 
          typingUsers: [...typingUsers, { userId, username, chatId }]
        });
      }
    } else {
      // Remove user from typing list
      set({
        typingUsers: typingUsers.filter(user => 
          !(user.userId === userId && user.chatId === chatId)
        )
      });
    }
  },

  deleteChat: (chatId: string) => {
    const { chats, messages } = get();
    
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    const updatedMessages = { ...messages };
    delete updatedMessages[chatId];
    
    set({ 
      chats: updatedChats,
      messages: updatedMessages,
      activeChat: get().activeChat === chatId ? null : get().activeChat
    });
    
    // Save to localStorage
    localStorage.setItem('chat-app-chats', JSON.stringify(updatedChats));
    localStorage.setItem('chat-app-messages', JSON.stringify(updatedMessages));
  },
}));
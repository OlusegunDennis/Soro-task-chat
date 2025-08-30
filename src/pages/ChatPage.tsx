import { useEffect } from 'react';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';

export function ChatPage() {
  const { loadChats } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadChats(user.id);
    }
  }, [user, loadChats]);

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}
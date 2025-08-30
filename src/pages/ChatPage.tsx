import { useEffect, useState } from 'react';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@/components/ui/button';
import { Menu, MessageCircle } from 'lucide-react';

export function ChatPage() {
  const { loadChats, activeChat, chats } = useChatStore();
  const { user } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Reset sidebar state when switching between mobile and desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // Auto-open sidebar on mobile when user logs in and has chats but no active chat
  useEffect(() => {
    if (isMobile && user && chats.length > 0 && !activeChat) {
      setIsSidebarOpen(true);
    }
  }, [isMobile, user, chats.length, activeChat]);

  useEffect(() => {
    if (user) {
      loadChats(user.id);
    }
  }, [user, loadChats]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-4 left-4 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      {/* Show sidebar on desktop or when sidebar is open on mobile */}
      {(!isMobile || isSidebarOpen) && <ChatSidebar isOpen={isMobile && isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      
      {/* Show chat window on desktop or when a chat is selected on mobile */}
      {(!isMobile || activeChat) && (
        <ChatWindow 
          isSidebarOpen={isMobile && isSidebarOpen} 
          onCloseSidebar={() => setIsSidebarOpen(false)} 
          isMobile={isMobile}
          isActive={!!activeChat}
        />
      )}
      
      {/* Show placeholder on mobile when no chat is selected and sidebar is closed */}
      {isMobile && !activeChat && !isSidebarOpen && (
        <div className="flex-1 flex items-center justify-center bg-background md:hidden">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Chat Pulse</h2>
            <p className="text-muted-foreground">Select a chat to start messaging</p>
            <Button 
              onClick={toggleSidebar}
              className="mt-4"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              View Chats
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
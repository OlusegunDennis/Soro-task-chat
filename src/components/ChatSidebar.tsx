import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageCircle, Crown, Settings, Trash2, User, X } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { toast } from '@/hooks/use-toast';
import { SettingsModal } from './SettingsModal';
import './ChatSidebar.css';

export function ChatSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void; }) {
  const navigate = useNavigate();
  const [newChatName, setNewChatName] = useState('');
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { chats, activeChat, setActiveChat, createChat, deleteChat } = useChatStore();
  const { user, upgradeToPremium } = useAuthStore();
  
  const handleCreateChat = () => {
    if (!newChatName.trim() || !user) return;
    
    // Check if user has reached limit
    const userChats = chats.filter(chat => chat.participants.includes(user.id));
    
    if (!user.isPremium && userChats.length >= 2) {
      toast({
        title: "Upgrade Required",
        description: "Free users can only create 2 chats. Upgrade to Premium for unlimited chats!",
        variant: "destructive",
      });
      return;
    }
    
    const chatId = createChat(newChatName, user.id);
    if (chatId) {
      setActiveChat(chatId);
      setNewChatName('');
      setShowNewChatInput(false);
      toast({
        title: "Chat Created",
        description: `"${newChatName}" has been created successfully.`,
      });
    }
  };

  const handleDeleteChat = (chatId: string, chatName: string) => {
    deleteChat(chatId);
    toast({
      title: "Chat Deleted",
      description: `"${chatName}" has been deleted.`,
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  return (
    <div className={`w-80 bg-card border-r border-border flex flex-col h-full md:w-64 lg:w-80 chat-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              navigate('/profile');
              if (onClose) onClose();
            }}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{user.username}</span>
                {user.isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-chat-online rounded-full"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => {
              navigate('/profile');
              if (onClose) onClose();
            }} className="md:hidden">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!user.isPremium && (
          <Button 
            onClick={upgradeToPremium}
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth hidden md:flex"
            size="sm"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        )}
      </div>

      {/* New Chat Section */}
      <div className="p-4 border-b border-border">
        {showNewChatInput ? (
          <div className="flex gap-2">
            <Input
              placeholder="Chat name..."
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateChat()}
              className="flex-1"
              autoFocus
            />
            <Button onClick={handleCreateChat} size="sm">
              Create
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setShowNewChatInput(false);
                setNewChatName('');
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setShowNewChatInput(true)}
            className="w-full" 
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No chats yet</p>
            <p className="text-muted-foreground text-xs">Create your first chat to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <Card 
                key={chat.id}
                className={`p-3 cursor-pointer transition-smooth hover:bg-muted/50 group ${
                  activeChat === chat.id ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={() => {
                  setActiveChat(chat.id);
                  // Close sidebar on mobile after selecting a chat
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-smooth h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.id, chat.name);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {chat.lastMessage && (
                      <>
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.lastMessage.content}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(chat.lastMessage.timestamp)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Usage Info for Free Users */}
      {!user.isPremium && (
        <div className="p-4 border-t border-border hidden md:block">
          <div className="text-center">
            <Badge variant="secondary" className="mb-2">
              Free Plan
            </Badge>
            <p className="text-xs text-muted-foreground">
              {chats.length}/2 chats created
            </p>
          </div>
        </div>
      )}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
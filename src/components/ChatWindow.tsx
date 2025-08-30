import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MoreVertical } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';

export function ChatWindow() {
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { 
    chats, 
    messages, 
    activeChat, 
    typingUsers,
    sendMessage, 
    setTyping 
  } = useChatStore();
  const { user } = useAuthStore();
  
  const currentChat = chats.find(chat => chat.id === activeChat);
  const currentMessages = activeChat ? messages[activeChat] || [] : [];
  const currentTypingUsers = typingUsers.filter(u => u.chatId === activeChat && u.userId !== user?.id);
  
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, currentTypingUsers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat || !user) return;
    
    sendMessage(activeChat, messageInput, user.id);
    setMessageInput('');
    
    // Stop typing indicator
    if (isTyping) {
      setTyping(activeChat, user.id, user.username, false);
      setIsTyping(false);
    }
  };

  const handleInputChange = (value: string) => {
    setMessageInput(value);
    
    if (!user || !activeChat) return;
    
    // Start typing indicator
    if (!isTyping && value.trim()) {
      setTyping(activeChat, user.id, user.username, true);
      setIsTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setTyping(activeChat, user.id, user.username, false);
        setIsTyping(false);
      }
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString();
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
            <Send className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Welcome to Chat Pulse</h2>
          <p className="text-muted-foreground">Select a chat to start messaging or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {currentChat.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-semibold">{currentChat.name}</h2>
            <p className="text-sm text-muted-foreground">
              {currentTypingUsers.length > 0 
                ? `${currentTypingUsers.map(u => u.username).join(', ')} ${currentTypingUsers.length === 1 ? 'is' : 'are'} typing...`
                : `Created ${formatDate(currentChat.createdAt)}`
              }
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Start the conversation</h3>
            <p className="text-muted-foreground text-sm">Send your first message to get things going</p>
          </div>
        ) : (
          <>
            {currentMessages.map((message, index) => {
              const isOwnMessage = message.senderId === user?.id;
              const showDate = index === 0 || 
                formatDate(message.timestamp) !== formatDate(currentMessages[index - 1].timestamp);
              
              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center my-4">
                      <Badge variant="secondary" className="text-xs">
                        {formatDate(message.timestamp)}
                      </Badge>
                    </div>
                  )}
                  
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`flex gap-3 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isOwnMessage && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={user?.avatar} alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`space-y-1 ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                        {!isOwnMessage && (
                          <span className="text-xs text-muted-foreground font-medium">
                            {user?.username || 'User'}
                          </span>
                        )}
                        <div className={`chat-bubble ${isOwnMessage ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        
        {/* Typing Indicator */}
        {currentTypingUsers.length > 0 && (
          <div className="flex justify-start mb-2">
            <div className="flex gap-3 max-w-[70%]">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback>
                  {currentTypingUsers[0].username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium">
                  {currentTypingUsers[0].username}
                </span>
                <div className="chat-bubble chat-bubble-received">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-chat-typing rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-chat-typing rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-chat-typing rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-gradient-primary hover:opacity-90 transition-smooth"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
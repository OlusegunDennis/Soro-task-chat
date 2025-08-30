import { create } from 'zustand';
import { User, AuthState } from '../types';

// Generate random avatar using Random User API
const generateRandomAvatar = () => {
  const seed = Math.random().toString(36).substring(7);
  return `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`;
};

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  upgradeToPremium: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,

  login: async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('chat-app-users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      set({ isAuthenticated: true, user: userWithoutPassword });
      localStorage.setItem('chat-app-current-user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  },

  signup: async (username: string, email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('chat-app-users') || '[]');
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      avatar: generateRandomAvatar(),
      isPremium: false,
      joinedAt: new Date(),
    };
    
    // Save user with password to localStorage
    const userWithPassword = { ...newUser, password };
    users.push(userWithPassword);
    localStorage.setItem('chat-app-users', JSON.stringify(users));
    
    // Set current user (without password)
    set({ isAuthenticated: true, user: newUser });
    localStorage.setItem('chat-app-current-user', JSON.stringify(newUser));
    
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem('chat-app-current-user');
  },

  upgradeToPremium: () => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      set({ user: updatedUser });
      localStorage.setItem('chat-app-current-user', JSON.stringify(updatedUser));
      
      // Update in users array as well
      const users = JSON.parse(localStorage.getItem('chat-app-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], isPremium: true };
        localStorage.setItem('chat-app-users', JSON.stringify(users));
      }
    }
  },
}));

// Initialize auth state from localStorage
const currentUser = localStorage.getItem('chat-app-current-user');
if (currentUser) {
  const user = JSON.parse(currentUser);
  useAuthStore.setState({ isAuthenticated: true, user });
}
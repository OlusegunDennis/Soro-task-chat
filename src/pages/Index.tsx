import { useAuthStore } from '../stores/authStore';
import { AuthPage } from '../components/AuthPage';
import { ChatPage } from './ChatPage';

const Index = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <ChatPage />;
};

export default Index;

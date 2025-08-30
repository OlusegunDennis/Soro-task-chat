# Chat Pulse 💬

A modern, real-time chat application built with React, TypeScript, and Tailwind CSS. Features beautiful UI, user authentication, subscription management, and local data persistence.

## ✨ Features

### 🔐 **User Authentication**
- Secure signup/login system with form validation
- Random avatar generation using Random User API
- Persistent login sessions

### 💬 **Chat System**
- Real-time messaging with smooth animations
- Create and manage multiple chat rooms
- Message timestamps and delivery indicators
- Typing indicators when users are composing messages
- Beautiful message bubbles with gradient styling

### 👑 **Subscription Management**
- **Free Plan**: Limited to 2 chat rooms
- **Premium Plan**: Unlimited chats with upgrade system
- Visual subscription status indicators
- One-click upgrade simulation

### 🎨 **Modern UI/UX**
- Dark theme with purple-blue gradient design
- Responsive design for all devices
- Smooth animations and transitions
- Clean, Discord/Slack-inspired interface
- Floating cards and glow effects
- **Dark/Light theme toggle** via settings menu

### 📱 **Additional Features**
- Local storage for data persistence
- User avatars and online status
- Chat deletion functionality
- Message history and date separators
- Professional toast notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to see the application

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Data Storage**: Local Storage (Browser)

## 📂 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn UI components
│   ├── AuthPage.tsx     # Login/Signup page
│   ├── ChatSidebar.tsx  # Chat list and user profile
│   └── ChatWindow.tsx   # Main chat interface
├── hooks/               # Custom React hooks
├── pages/               # Application pages
├── stores/              # Zustand state stores
├── types/               # TypeScript type definitions
└── lib/                 # Utility functions
```

## 🎯 How to Use

### 1. **Create an Account**
- Click "Sign Up" and fill in your details
- Your avatar will be automatically generated
- You'll be logged in immediately after signup

### 2. **Start Chatting**
- Click "New Chat" to create your first chat room
- Type a name for your chat and start messaging
- Free users can create up to 2 chats

### 3. **Upgrade to Premium**
- Click the "Upgrade to Premium" button for unlimited chats
- Premium users get a crown badge and unlimited features

### 4. **Chat Features**
- Type messages and see them appear instantly
- Watch typing indicators when others are composing
- Delete chats you no longer need
- View message timestamps and date separators

### 5. **Theme Settings**
- Click the settings icon in the top right corner
- Toggle between dark and light themes
- Your preference is saved automatically

## 🔧 Configuration

### Customizing the Design
The app uses a comprehensive design system defined in:
- `src/index.css` - CSS variables and component styles
- `tailwind.config.ts` - Tailwind theme extensions

### Data Storage
Currently uses browser localStorage. To integrate with a backend:
1. Connect to Supabase using Lovable's native integration
2. Update the store functions in `src/stores/`
3. Replace localStorage calls with API calls

## 🚀 Deployment

The app can be deployed on any static hosting service:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

### Recommended Platforms
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 🛡️ Security Notes

- This is a demo application with simulated authentication
- Passwords are stored in localStorage (not recommended for production)
- For production use, implement proper backend authentication
- Consider using Supabase for secure user management

## 🎨 Design System

### Colors
- **Primary**: Purple-blue gradient (`250 84% 60%` to `280 85% 70%`)
- **Background**: Dark theme (`240 10% 3.9%`)
- **Accent**: Online indicators, typing badges
- **Gradients**: Smooth purple-blue transitions

### Typography
- Clean, readable fonts with proper hierarchy
- Gradient text effects for branding
- Consistent spacing and sizing

### Animations
- Smooth transitions (`0.3s cubic-bezier`)
- Bounce effects for interactive elements
- Typing indicator animations
- Glow effects on focus states

## 📋 Future Enhancements

- [ ] Voice messages
- [ ] File sharing
- [ ] Group chat management
- [ ] Push notifications
- [x] Dark/light theme toggle
- [ ] Message reactions
- [ ] User presence indicators
- [ ] Chat search functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered development platform
- UI components from [Shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Avatars from [Random User API](https://randomuser.me)

---

**Chat Pulse** - Connect, chat, and collaborate in style! 🚀
import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import ChatApp from './components/ChatApp';
import './App.css';

function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('max_chat_session');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (data) => {
    setSession(data);
    localStorage.setItem('max_chat_session', JSON.stringify(data));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('max_chat_session');
  };

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <ChatApp session={session} onLogout={handleLogout} />;
}

export default App;
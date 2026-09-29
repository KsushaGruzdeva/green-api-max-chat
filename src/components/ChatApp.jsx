import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import './ChatApp.css';

function ChatApp({ session, onLogout }) {
  const { idInstance, apiTokenInstance, phone, baseUrl } = session;
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const pollRef = useRef(null);

  const chatId = `${phone}@c.us`;

  useEffect(() => {
    const saved = localStorage.getItem(`max_chat_messages_${chatId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка чтения истории', e);
      }
    }
  }, [chatId]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`max_chat_messages_${chatId}`, JSON.stringify(messages));
    }
  }, [messages, chatId]);

  useEffect(() => {
    setIsConnected(true);

    const receiveMessages = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
        );

        if (response.status === 204 || response.status === 408) return;
        if (!response.ok) return;

        const data = await response.json();

        if (!data || !data.receiptId || !data.body) return;

        const body = data.body;
        const messageData = body.messageData || {};
        
        const msgText = messageData.textMessageData?.textMessage || messageData.caption || body.textMessage;
        const msgType = messageData.typeMessage;

        if (msgText) {
          const senderPhone = body.senderData?.senderPhoneNumber || body.senderData?.chatId?.replace('@c.us', '') || '';
          const timestamp = body.timestamp || Date.now();

          console.log('ПОЛУЧЕНО СООБЩЕНИЕ:', { senderPhone, text: msgText, type: msgType });

          setMessages((prev) => {
            const exists = prev.some((m) => m.id === `in_${data.receiptId}`);
            if (exists) return prev;

            return [
              ...prev,
              {
                id: `in_${data.receiptId}`,
                type: 'incoming',
                text: msgText,
                sender: senderPhone,
                timestamp,
              },
            ];
          });
          setLastSeen(new Date());
        } else {
          console.log('Пришло уведомление без текста. Тип:', msgType);
          console.log('messageData:', messageData);
        }

        if (data.receiptId) {
          await fetch(
            `${baseUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${data.receiptId}`,
            { method: 'DELETE' }
          );
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Polling ошибка:', err.message);
        }
      }
    };

    pollRef.current = setInterval(receiveMessages, 2000);
    receiveMessages();

    return () => {
      clearInterval(pollRef.current);
      setIsConnected(false);
    };
  }, [idInstance, apiTokenInstance, phone, baseUrl]);

  const sendMessage = async (text) => {
    const tempId = `out_${Date.now()}`;
    const timestamp = Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        type: 'outgoing',
        text,
        timestamp,
        status: 'sending',
      },
    ]);

    try {
      const url = `${baseUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message: text }),
      });

      const data = await res.json();

      if (data?.idMessage) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? { ...m, id: `out_${data.idMessage}`, status: 'sent' }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: 'error' } : m))
        );
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'error' } : m))
      );
    }
  };

  const clearChat = () => {
    if (window.confirm('Очистить историю чата?')) {
      setMessages([]);
      localStorage.removeItem(`max_chat_messages_${chatId}`);
    }
  };

  return (
    <div className="chat-app">
      <Sidebar
        session={session}
        isConnected={isConnected}
        lastSeen={lastSeen}
        onLogout={onLogout}
        onClearChat={clearChat}
      />
      <ChatWindow
        phone={phone}
        messages={messages}
        onSendMessage={sendMessage}
        isConnected={isConnected}
      />
    </div>
  );
}

export default ChatApp;
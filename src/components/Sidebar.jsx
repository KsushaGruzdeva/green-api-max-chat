import './Sidebar.css';

function Sidebar({ session, isConnected, lastSeen, onLogout, onClearChat }) {
  const { phone } = session;

  const formatLastSeen = (date) => {
    if (!date) return 'Неактивен';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин назад`;
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="avatar large">
            {phone.slice(-2)}
          </div>
          <div>
            <div className="user-name">MAX Chat</div>
            <div className={`user-status ${isConnected ? 'online' : 'offline'}`}>
              <span className="status-dot"></span>
              {isConnected ? 'Подключено' : 'Отключено'}
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        <div className="section-title">Активный чат</div>
        
        <div className="chat-item active">
          <div className="avatar">
            {phone.slice(-2)}
          </div>
          <div className="chat-info">
            <div className="chat-name">+{phone}</div>
            <div className="chat-preview">
              {lastSeen ? `Последняя активность: ${formatLastSeen(lastSeen)}` : 'Ожидание сообщений...'}
            </div>
          </div>
          {isConnected && <div className="unread-badge">●</div>}
        </div>

        <div className="sidebar-actions">
          <button className="btn-action" onClick={onClearChat}>
            🗑️ Очистить чат
          </button>
          <button className="btn-action danger" onClick={onLogout}>
            🚪 Выйти
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
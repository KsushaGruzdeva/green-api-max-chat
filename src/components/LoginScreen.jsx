import { useState } from 'react';
import './LoginScreen.css';

function LoginScreen({ onLogin }) {
  const [step, setStep] = useState(1);
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (idInstance && apiTokenInstance) {
      setStep(2);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setError('');

    try {
      const serverNumber = idInstance.toString().slice(0, 4);
      const baseUrl = `https://${serverNumber}.api.green-api.com`;

      const response = await fetch(
        `${baseUrl}/waInstance${idInstance}/getSettings/${apiTokenInstance}`
      );
      
      if (!response.ok) {
        throw new Error('Неверные учетные данные GREEN-API');
      }

      const data = await response.json();
      
      onLogin({
        idInstance,
        apiTokenInstance,
        phone: phone.replace(/\D/g, ''),
        baseUrl,
        accountData: data
      });
    } catch (err) {
      setError(err.message || 'Ошибка подключения. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-background">
        <div className="pattern"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .98 4.3L2 22l5.7-1.98C9 20.64 10.46 21 12 21c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#667eea"/>
                <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1>MAX Chat</h1>
            <p className="subtitle">Мессенджер через GREEN-API</p>
          </div>

          {step === 1 && (
            <form onSubmit={handleCredentialsSubmit} className="login-form">
              <div className="form-group">
                <label>ID Instance</label>
                <input
                  type="text"
                  value={idInstance}
                  onChange={(e) => setIdInstance(e.target.value)}
                  placeholder="1101234567"
                  required
                />
                <small>Ваш ID из личного кабинета GREEN-API</small>
              </div>

              <div className="form-group">
                <label>API Token Instance</label>
                <input
                  type="password"
                  value={apiTokenInstance}
                  onChange={(e) => setApiTokenInstance(e.target.value)}
                  placeholder="••••••••••••••••"
                  required
                />
                <small>Токен авторизации из личного кабинета</small>
              </div>

              <button type="submit" className="btn-primary">
                Продолжить →
              </button>

              <div className="info-box">
                <p>📱 Не знаете, где взять данные?</p>
                <a href="https://green-api.com/max" target="_blank" rel="noreferrer">
                  Перейти на green-api.com/max →
                </a>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePhoneSubmit} className="login-form">
              <button 
                type="button" 
                className="btn-back"
                onClick={() => setStep(1)}
              >
                ← Назад
              </button>

              <div className="form-group">
                <label>Номер телефона получателя</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="79257217303"
                  required
                />
                <small>Формат: 79257217303 (без + и пробелов)</small>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Подключение...' : 'Создать чат'}
              </button>

              <div className="info-box">
                <p> Убедитесь, что:</p>
                <ul>
                  <li>Ваш телефон с MAX подключен к GREEN-API</li>
                  <li>Получатель использует мессенджер MAX</li>
                </ul>
              </div>
            </form>
          )}
        </div>

        <div className="login-footer">
          <p>Тестовое задание • Фронтенд разработчик React</p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
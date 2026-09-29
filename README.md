# MAX Chat - Green-API

Frontend-приложение чата, разработанное в рамках тестового задания. Интегрировано с мессенджером MAX через [Green-API](https://green-api.com/).

**Живая демонстрация:** https://ksushagruzdeva.github.io/green-api-max-chat/

## Возможности
- Двухэтапная авторизация (ввод ID инстанса и токена).
- Отправка текстовых сообщений через API (`sendMessage`).
- Получение входящих сообщений в реальном времени через Long Polling (`receiveNotification` + `deleteNotification`).
- Устойчивость к ошибкам сети (обработка таймаутов 408 и пустых очередей 204).
- Корректная обработка различных типов сообщений (`textMessage`, `extendedTextMessage`).
- Сохранение истории переписки в `localStorage`.
- Адаптивный и современный UI, вдохновленный популярными мессенджерами.

## Стек технологий
- **React 18** (Functional Components, Hooks)
- **Vite** (Сборка и локальный сервер)
- **CSS3** (Flexbox, анимации, кастомные переменные)
- **Green-API** (HTTP REST API)

## Установка и локальный запуск

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/ТВОЙ_НИК/green-api-max-chat.git
   cd green-api-max-chat
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Запустите сервер разработки:
   ```bash
    npm run dev
   ```

4. Откройте в браузере: http://localhost:5173


## Как это работает (Архитектура)
1. Пользователь вводит `idInstance` и `apiTokenInstance`.
2. Приложение определяет базовый URL сервера (например, `https://3100.api.green-api.com`).
3. При отправке сообщения формируется POST-запрос к методу `sendMessage`.
4. Для получения сообщений запущен `setInterval` (каждые 2 сек), который опрашивает метод `receiveNotification`.
5. При получении уведомления с типом `textMessage` или `extendedTextMessage`, оно добавляется в стейт, а затем подтверждается методом `deleteNotification` (чтобы удалить его из очереди FIFO).
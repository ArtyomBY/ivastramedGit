# Ivastrameds Medical Platform

Современная веб-платформа для управления медицинскими услугами с поддержкой чата в реальном времени.

## Требования

- Node.js 16+ 
- MySQL 8.0+
- npm или yarn

## Установка

1. Клонируйте репозиторий:
```bash
git clone [your-repository-url]
```

2. Установите зависимости для фронтенда:
```bash
cd ivastrameds
npm install
```

3. Установите зависимости для бэкенда:
```bash
cd backend
npm install
```

4. Создайте файлы .env в корневой директории и в папке backend:

Для фронтенда (.env):
```
REACT_APP_API_URL=http://your-backend-url:5000
REACT_APP_WS_URL=ws://your-backend-url:5000
```

Для бэкенда (backend/.env):
```
# Database Configuration
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=production

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads/

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

5. Создайте базу данных и примените миграции:
```bash
cd backend
npm run migrate
```

## Сборка

1. Сборка фронтенда:
```bash
npm run build
```

2. Сборка бэкенда:
```bash
cd backend
npm run build
```

## Развертывание

1. Настройте веб-сервер (nginx/apache) для проксирования запросов к бэкенду
2. Настройте SSL-сертификаты
3. Настройте PM2 для управления процессом Node.js

Пример конфигурации nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        root /path/to/ivastrameds/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## Безопасность

1. Убедитесь, что все секретные ключи и пароли надежно защищены
2. Используйте SSL/TLS для всех соединений
3. Настройте брандмауэр
4. Регулярно обновляйте зависимости
5. Настройте резервное копирование базы данных

## Мониторинг

1. Настройте PM2 для мониторинга процессов Node.js
2. Настройте логирование
3. Настройте мониторинг сервера (CPU, память, диск)

## Поддержка

При возникновении проблем обращайтесь в службу поддержки или создавайте issue в репозитории.

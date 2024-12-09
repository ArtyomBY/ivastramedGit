import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import api from './api';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Безопасность
app.use(helmet());
app.use(compression());

// CORS и парсинг JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование тела запроса
app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log('Request URL:', req.url);
        console.log('Request body:', req.body);
    }
    next();
});

// Использование API маршрутов
app.use('/api', api);

// Раздача статических файлов фронтенда
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

// Все остальные GET-запросы направляем на React приложение
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html'));
});

// Использование обработчика ошибок
app.use(errorHandler);

export default app;

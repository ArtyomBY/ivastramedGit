import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import api from './api';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Настройка middleware
app.use(helmet({
    contentSecurityPolicy: false // Отключаем CSP для разработки
}));
app.use(cors());
app.use(compression()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

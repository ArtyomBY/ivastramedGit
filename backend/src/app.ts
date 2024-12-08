import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patient';
import doctorRoutes from './routes/doctor';
import documentRoutes from './routes/document';
import messageRoutes from './routes/message';
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

// Использование маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);

// Раздача статических файлов фронтенда
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

// Все остальные GET-запросы направляем на React приложение
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html'));
});

// Использование обработчика ошибок
app.use(errorHandler);

export default app;

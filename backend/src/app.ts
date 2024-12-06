import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patient';
import doctorRoutes from './routes/doctor';
import documentRoutes from './routes/document';
import messageRoutes from './routes/message';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Настройка middleware
app.use(helmet());
app.use(cors());
app.use(compression()); // Проверено и исправлено использование compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Использование маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);

// Раздача статических файлов фронтенда
app.use(express.static(path.join(__dirname, '../../build')));

// Все остальные GET-запросы направляем на React приложение
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// Использование обработчика ошибок
app.use(errorHandler);

// Базовый маршрут
// app.get('/', (req, res) => {
//   res.send('Welcome to IvastRameds Backend!');
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

export default app;

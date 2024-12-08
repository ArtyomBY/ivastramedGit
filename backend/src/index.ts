import * as dotenv from 'dotenv';
import app from './app';

// Загружаем переменные окружения
dotenv.config();

const PORT = process.env.PORT || 3000;

// Обработка необработанных исключений
process.on('uncaughtException', (error: Error) => {
    console.error('Необработанное исключение:', error);
    process.exit(1);
});

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('Необработанное отклонение промиса:', reason);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

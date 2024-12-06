import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import patientRoutes from './routes/patient';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Подключение маршрутов
app.use('/api/patients', patientRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Подключение к базе данных
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ivastrameds', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Подключение к базе данных успешно');
}).catch(err => {
    console.error('Ошибка подключения к базе данных:', err);
});

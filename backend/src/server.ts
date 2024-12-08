import app from './app';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

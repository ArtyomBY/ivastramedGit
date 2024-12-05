import express from 'express';
import { AuthController } from '../controllers/AuthController';
const router = express.Router();

// Маршрут для регистрации
router.post('/register', AuthController.register);

// Маршрут для входа
router.post('/login', AuthController.login);

export default router;

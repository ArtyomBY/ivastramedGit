import express from 'express';
import { MessageController } from '../controllers/MessageController';
import { authenticate } from '../middleware/auth';
import { validateMessageData } from '../middleware/validation';

const router = express.Router();

// Маршрут для получения всех сообщений
router.get('/', authenticate, MessageController.getAllMessages);

// Маршрут для получения сообщения по ID
router.get('/:id', authenticate, (req, res, next) => {
    MessageController.getMessageById(req, res).catch(next);
});

// Маршрут для создания нового сообщения
router.post('/', authenticate, validateMessageData, MessageController.createMessage);

// Маршрут для обновления сообщения
router.put('/:id', authenticate, validateMessageData, MessageController.updateMessage);

// Маршрут для удаления сообщения
router.delete('/:id', authenticate, MessageController.deleteMessage);

export default router;

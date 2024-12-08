import { Router } from 'express';
import * as chatsController from '../controllers/chats.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, chatsController.getUserChats);
router.get('/:chatId/messages', authMiddleware, chatsController.getChatMessages);
router.post('/:chatId/messages', authMiddleware, chatsController.sendMessage);

export default router;

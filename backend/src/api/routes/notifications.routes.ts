import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as notificationsController from '../controllers/notifications.controller';

const router = Router();

router.get('/', authMiddleware, notificationsController.getNotifications);
router.put('/:notificationId/read', authMiddleware, notificationsController.markNotificationAsRead);
router.put('/read-all', authMiddleware, notificationsController.markAllNotificationsAsRead);
router.delete('/:notificationId', authMiddleware, notificationsController.deleteNotification);

export default router;

import { Response } from 'express';
import { pool } from '../../config/database';
import { AuthRequest } from '../../types';
import { NotificationRow } from '../../types/database';

// Получение списка уведомлений
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { unreadOnly } = req.query;

        let query = `
            SELECT *
            FROM notifications
            WHERE user_id = ?
        `;

        const queryParams: any[] = [userId];

        if (unreadOnly === 'true') {
            query += ' AND read_at IS NULL';
        }

        query += ' ORDER BY created_at DESC';

        const [notifications] = await pool.query<NotificationRow[]>(query, queryParams);

        res.json(notifications);
    } catch (error) {
        console.error('Ошибка при получении уведомлений:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Пометка уведомления как прочитанного
export const markNotificationAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { notificationId } = req.params;
        const userId = req.user?.id;

        // Проверяем, существует ли уведомление и принадлежит ли оно пользователю
        const [notifications] = await pool.query<NotificationRow[]>(
            'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );

        if (!notifications || notifications.length === 0) {
            res.status(404).json({ message: 'Уведомление не найдено' });
            return;
        }

        // Помечаем уведомление как прочитанное
        await pool.query(
            'UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE id = ?',
            [notificationId]
        );

        res.json({ message: 'Уведомление помечено как прочитанное' });
    } catch (error) {
        console.error('Ошибка при обновлении уведомления:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Пометка всех уведомлений как прочитанных
export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        // Помечаем все непрочитанные уведомления пользователя как прочитанные
        await pool.query(
            'UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE user_id = ? AND read_at IS NULL',
            [userId]
        );

        res.json({ message: 'Все уведомления помечены как прочитанные' });
    } catch (error) {
        console.error('Ошибка при обновлении уведомлений:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Удаление уведомления
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { notificationId } = req.params;
        const userId = req.user?.id;

        // Проверяем, существует ли уведомление и принадлежит ли оно пользователю
        const [notifications] = await pool.query<NotificationRow[]>(
            'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );

        if (!notifications || notifications.length === 0) {
            res.status(404).json({ message: 'Уведомление не найдено' });
            return;
        }

        // Удаляем уведомление
        await pool.query(
            'DELETE FROM notifications WHERE id = ?',
            [notificationId]
        );

        res.json({ message: 'Уведомление удалено' });
    } catch (error) {
        console.error('Ошибка при удалении уведомления:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

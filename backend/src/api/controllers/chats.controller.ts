import { Request, Response } from 'express';
import { pool } from '../../config/database';
import { AuthRequest } from '../../types';
import { ChatRow, MessageRow } from '../../types/database';

// Получение списка чатов пользователя
export const getUserChats = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;

        const [chats] = await pool.query<ChatRow[]>(`
            SELECT 
                c.*,
                CASE 
                    WHEN c.user1_id = ? THEN u2.first_name
                    ELSE u1.first_name
                END as other_user_first_name,
                CASE 
                    WHEN c.user1_id = ? THEN u2.last_name
                    ELSE u1.last_name
                END as other_user_last_name,
                m.content as last_message,
                m.sent_at as last_message_time
            FROM chats c
            JOIN users u1 ON c.user1_id = u1.id
            JOIN users u2 ON c.user2_id = u2.id
            LEFT JOIN messages m ON c.id = m.chat_id
            WHERE c.user1_id = ? OR c.user2_id = ?
            GROUP BY c.id
            ORDER BY m.sent_at DESC NULLS LAST
        `, [userId, userId, userId, userId]);

        return res.json(chats);
    } catch (error) {
        console.error('Ошибка при получении чатов:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Получение сообщений чата
export const getChatMessages = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const { chatId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        // Проверяем доступ к чату
        const [chatAccess] = await pool.query(`
            SELECT 
                c.id,
                CASE 
                    WHEN ? = 'patient' THEN p.user_id
                    WHEN ? = 'doctor' THEN d.user_id
                END as user_id
            FROM chats c
            JOIN patients p ON c.patient_id = p.id
            JOIN doctors d ON c.doctor_id = d.id
            WHERE c.id = ? AND c.is_active = TRUE
        `, [userRole, userRole, chatId]);

        if (!chatAccess || (chatAccess as any[]).length === 0 || (chatAccess as any[])[0].user_id !== userId) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        // Получаем сообщения
        const offset = (Number(page) - 1) * Number(limit);
        const [messages] = await pool.query<MessageRow[]>(`
            SELECT 
                m.id,
                m.message,
                m.message_type,
                m.file_url,
                m.is_read,
                m.created_at,
                u.id as sender_id,
                u.first_name as sender_first_name,
                u.last_name as sender_last_name,
                u.role as sender_role
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.chat_id = ?
            ORDER BY m.created_at DESC
            LIMIT ? OFFSET ?
        `, [chatId, Number(limit), offset]);

        // Помечаем сообщения как прочитанные
        await pool.query(`
            UPDATE messages 
            SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
            WHERE chat_id = ? AND sender_id != ? AND is_read = FALSE
        `, [chatId, userId]);

        return res.json(messages);
    } catch (error) {
        console.error('Ошибка при получении сообщений чата:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Отправка сообщения
export const sendMessage = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { chatId, content } = req.body;
        const senderId = req.user?.id;

        // Проверяем, существует ли чат и является ли пользователь его участником
        const [chats] = await pool.query<ChatRow[]>(
            'SELECT * FROM chats WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
            [chatId, senderId, senderId]
        );

        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: 'Чат не найден' });
        }

        // Создаем сообщение
        const [result] = await pool.query(
            'INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)',
            [chatId, senderId, content]
        );

        // Обновляем время последнего сообщения в чате
        await pool.query(
            'UPDATE chats SET last_message_at = CURRENT_TIMESTAMP WHERE id = ?',
            [chatId]
        );

        return res.status(201).json({
            message: 'Сообщение отправлено',
            messageId: (result as any).insertId
        });
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Получение истории сообщений
export const getChatHistory = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { chatId } = req.params;
        const userId = req.user?.id;

        // Проверяем, является ли пользователь участником чата
        const [chats] = await pool.query<ChatRow[]>(
            'SELECT * FROM chats WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
            [chatId, userId, userId]
        );

        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: 'Чат не найден' });
        }

        // Получаем сообщения
        const [messages] = await pool.query<MessageRow[]>(`
            SELECT 
                m.*,
                u.first_name as sender_first_name,
                u.last_name as sender_last_name
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.chat_id = ?
            ORDER BY m.sent_at ASC
        `, [chatId]);

        // Помечаем непрочитанные сообщения как прочитанные
        await pool.query(`
            UPDATE messages 
            SET read_at = CURRENT_TIMESTAMP 
            WHERE chat_id = ? AND sender_id != ? AND read_at IS NULL
        `, [chatId, userId]);

        return res.json(messages);
    } catch (error) {
        console.error('Ошибка при получении истории сообщений:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

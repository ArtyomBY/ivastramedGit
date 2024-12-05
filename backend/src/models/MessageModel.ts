import { pool } from '../config/database';
import mysql2 from 'mysql2/promise';

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: Date;
}

export class MessageModel {
  static async getAllMessages(): Promise<Message[]> {
    const [rows] = await pool.execute('SELECT * FROM messages');
    return rows as Message[];
  }

  static async getMessageById(id: number): Promise<Message | null> {
    const [rows] = await pool.execute<mysql2.RowDataPacket[]>('SELECT * FROM messages WHERE id = ?', [id]);
    const message = rows[0];
    return message ? (message as Message) : null;
  }

  static async createMessage(message: Omit<Message, 'id' | 'sentAt'>): Promise<number> {
    const [result] = await pool.execute<mysql2.ResultSetHeader>(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [message.senderId, message.receiverId, message.content]
    );
    return result.insertId;
  }

  static async updateMessage(id: number, message: Partial<Omit<Message, 'id' | 'sentAt'>>): Promise<void> {
    await pool.execute(
      'UPDATE messages SET sender_id = ?, receiver_id = ?, content = ? WHERE id = ?',
      [message.senderId, message.receiverId, message.content, id]
    );
  }

  static async deleteMessage(id: number): Promise<void> {
    await pool.execute('DELETE FROM messages WHERE id = ?', [id]);
  }
}

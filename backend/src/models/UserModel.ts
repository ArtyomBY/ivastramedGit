import { pool } from '../config/database';
import mysql2, { RowDataPacket } from 'mysql2/promise';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string; // Добавлено поле для роли
}

export class UserModel {
  static async createUser(user: User): Promise<number> {
    const [result] = await pool.execute<mysql2.ResultSetHeader>(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [user.firstName, user.lastName, user.email, user.password, user.role]
    );
    return result.insertId;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    return user ? (user as User) : null;
  }

  static async getUserById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    const user = rows[0];
    return user ? (user as User) : null;
  }
}

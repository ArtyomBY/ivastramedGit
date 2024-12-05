import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { pool } from '../config/database';
import mysql2, { RowDataPacket } from 'mysql2/promise';

const secret: Secret = process.env.JWT_SECRET || 'default_secret';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const { email, password, firstName, lastName } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute<mysql2.ResultSetHeader>(
        'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName]
      );

      const token = jwt.sign({ id: result.insertId, email }, secret, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  }
}

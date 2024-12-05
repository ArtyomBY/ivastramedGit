import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import mysql2, { RowDataPacket } from 'mysql2/promise';

const secret = process.env.JWT_SECRET || 'default_secret';

export class AuthController {
  static async register(req: Request, res: Response) {
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
      res.status(500).json({ message: 'Registration failed.', error });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Login failed.', error });
    }
  }
}

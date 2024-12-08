import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/database';
import { config } from '../../config/config';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
    id: number;
    email: string;
    password_hash: string;
    role: string;
    is_active: boolean;
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const [rows] = await pool.query<UserRow[]>(
            'SELECT id, email, password_hash, role, is_active FROM users WHERE email = ?',
            [email]
        );

        if (!rows || rows.length === 0) {
            res.status(401).json({ message: 'Неверный email или пароль' });
            return;
        }

        const user = rows[0];

        if (!user.is_active) {
            res.status(401).json({ message: 'Аккаунт деактивирован' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            res.status(401).json({ message: 'Неверный email или пароль' });
            return;
        }

        const token = jwt.sign(
            { id: user.id.toString(), role: user.role, email: user.email },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        // Обновляем время последнего входа
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            middleName,
            phone,
            passport,
            oms,
            address,
            birthDate,
            gender,
            bloodType,
            allergies,
            chronicDiseases,
            emergencyContactName,
            emergencyContactPhone
        } = req.body;

        // Проверяем, не занят ли email
        const [existingUsers] = await pool.query<UserRow[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            res.status(400).json({
                message: 'Пользователь с таким email уже существует'
            });
            return;
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Хешируем пароль
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Создаем пользователя
            const [userResult] = await connection.query(
                `INSERT INTO users (
                    email, password_hash, first_name, last_name,
                    middle_name, phone, passport, oms,
                    address, birth_date, gender, role
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'patient')`,
                [email, passwordHash, firstName, lastName, middleName,
                 phone, passport, oms, address, birthDate, gender]
            );

            const userId = (userResult as any).insertId;

            // Создаем запись пациента
            const [patientResult] = await connection.query(
                `INSERT INTO patients (
                    user_id, medical_record_number, blood_type,
                    allergies, chronic_diseases,
                    emergency_contact_name, emergency_contact_phone
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, `MRN${Date.now()}`, bloodType, allergies,
                 chronicDiseases, emergencyContactName, emergencyContactPhone]
            );

            await connection.commit();

            const token = jwt.sign(
                { id: userId.toString(), role: 'patient', email },
                config.jwtSecret,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Регистрация успешна',
                token,
                user: {
                    id: userId,
                    email,
                    role: 'patient'
                }
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

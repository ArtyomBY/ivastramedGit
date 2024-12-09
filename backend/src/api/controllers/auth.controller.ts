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
    first_name: string;
    last_name: string;
    middle_name: string;
    phone: string;
    passport: string;
    oms: string;
    address: string;
    birth_date: string;
    gender: string;
    medical_record_number: string;
    blood_type: string;
    allergies: string;
    chronic_diseases: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        const [rows] = await pool.query<UserRow[]>(
            `SELECT u.*, p.medical_record_number, p.blood_type, p.allergies, p.chronic_diseases,
             p.emergency_contact_name, p.emergency_contact_phone
             FROM users u
             LEFT JOIN patients p ON u.id = p.user_id
             WHERE u.email = ?`,
            [email]
        );

        console.log('Database response for user:', rows);

        if (!rows || rows.length === 0) {
            console.log('User not found for email:', email);
            res.status(401).json({ message: 'Неверный email или пароль' });
            return;
        }

        const user = rows[0];

        if (!user.is_active) {
            console.log('User account is inactive for email:', email);
            res.status(401).json({ message: 'Аккаунт деактивирован' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            console.log('Invalid password for email:', email);
            res.status(401).json({ message: 'Неверный email или пароль' });
            return;
        }

        const token = jwt.sign(
            { id: user.id.toString(), role: user.role, email: user.email },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        console.log('Login successful for email:', email);
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name,
                middleName: user.middle_name,
                phone: user.phone,
                passport: user.passport,
                oms: user.oms,
                address: user.address,
                birthDate: user.birth_date,
                gender: user.gender,
                medicalRecordNumber: user.medical_record_number,
                bloodType: user.blood_type,
                allergies: user.allergies,
                chronicDiseases: user.chronic_diseases,
                emergencyContactName: user.emergency_contact_name,
                emergencyContactPhone: user.emergency_contact_phone
            }
        });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Received registration data:', req.body);
        
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

        if (!email || !password || !firstName || !lastName || !middleName || !phone || !passport || !oms || !address || !birthDate || !gender) {
            console.log('Missing required fields');
            res.status(400).json({
                message: 'Все обязательные поля должны быть заполнены'
            });
            return;
        }

        const [existingUsers] = await pool.query<UserRow[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            console.log('Email already exists:', email);
            res.status(400).json({
                message: 'Пользователь с таким email уже существует'
            });
            return;
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            console.log('Creating user in database...');
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
            console.log('User created with ID:', userId);

            const medicalRecordNumber = `MRN${Date.now()}`;
            console.log('Creating patient record...');
            const [patientResult] = await connection.query(
                `INSERT INTO patients (
                    user_id, medical_record_number, blood_type,
                    allergies, chronic_diseases,
                    emergency_contact_name, emergency_contact_phone
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, medicalRecordNumber, bloodType || null, allergies || null,
                 chronicDiseases || null, emergencyContactName || null, emergencyContactPhone || null]
            );
            console.log('Patient record created');

            await connection.commit();
            console.log('Transaction committed');

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
                    role: 'patient',
                    firstName,
                    lastName,
                    middleName,
                    phone,
                    passport,
                    oms,
                    address,
                    birthDate,
                    gender,
                    medicalRecordNumber,
                    bloodType: bloodType || null,
                    allergies: allergies || null,
                    chronicDiseases: chronicDiseases || null,
                    emergencyContactName: emergencyContactName || null,
                    emergencyContactPhone: emergencyContactPhone || null
                }
            });
        } catch (error) {
            console.error('Error in transaction:', error);
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

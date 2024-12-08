import { Request, Response } from 'express';
import { pool } from '../../config/database';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        email: string;
    };
}

interface UserRow extends RowDataPacket {
    id: number;
    role: string;
}

// Создание нового врача
export const createDoctor = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            middleName,
            phone,
            specializationId,
            experience,
            education,
            certifications
        } = req.body;

        // Проверяем, не существует ли уже пользователь с таким email
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if ((existingUsers as any[]).length > 0) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем пользователя
        const [userResult] = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name, middle_name, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, firstName, lastName, middleName, phone, 'doctor']
        );

        const userId = (userResult as any).insertId;

        // Создаем профиль врача
        const [doctorResult] = await pool.query(
            'INSERT INTO doctors (user_id, specialization_id, experience, education, certifications) VALUES (?, ?, ?, ?, ?)',
            [userId, specializationId, experience, education, certifications]
        );

        return res.status(201).json({
            message: 'Врач успешно создан',
            doctorId: (doctorResult as any).insertId
        });
    } catch (error) {
        console.error('Ошибка при создании врача:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Создание нового регистратора
export const createRegistrar = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            middleName,
            phone
        } = req.body;

        // Проверяем, не существует ли уже пользователь с таким email
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if ((existingUsers as any[]).length > 0) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем пользователя
        const [result] = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name, middle_name, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, firstName, lastName, middleName, phone, 'registrar']
        );

        return res.status(201).json({
            message: 'Регистратор успешно создан',
            userId: (result as any).insertId
        });
    } catch (error) {
        console.error('Ошибка при создании регистратора:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Управление специализациями
export const manageSpecializations = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { action } = req.query;
        const { id, name, description, defaultAppointmentDuration } = req.body;

        switch (action) {
            case 'create':
                const [createResult] = await pool.query(
                    'INSERT INTO specializations (name, description, default_appointment_duration) VALUES (?, ?, ?)',
                    [name, description, defaultAppointmentDuration]
                );
                return res.status(201).json({
                    message: 'Специализация создана',
                    specializationId: (createResult as any).insertId
                });

            case 'update':
                await pool.query(
                    'UPDATE specializations SET name = ?, description = ?, default_appointment_duration = ? WHERE id = ?',
                    [name, description, defaultAppointmentDuration, id]
                );
                return res.json({ message: 'Специализация обновлена' });

            case 'delete':
                // Проверяем, есть ли врачи с этой специализацией
                const [doctors] = await pool.query(
                    'SELECT * FROM doctors WHERE specialization_id = ?',
                    [id]
                );

                if ((doctors as any[]).length > 0) {
                    return res.status(400).json({
                        message: 'Невозможно удалить специализацию, так как есть врачи с этой специализацией'
                    });
                }

                await pool.query('DELETE FROM specializations WHERE id = ?', [id]);
                return res.json({ message: 'Специализация удалена' });

            default:
                return res.status(400).json({ message: 'Неизвестное действие' });
        }
    } catch (error) {
        console.error('Ошибка при управлении специализациями:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Управление пользователями
export const manageUsers = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { action } = req.query;
        const { userId, isActive } = req.body;

        switch (action) {
            case 'block':
                await pool.query(
                    'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [false, userId]
                );
                return res.json({ message: 'Пользователь заблокирован' });

            case 'unblock':
                await pool.query(
                    'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [true, userId]
                );
                return res.json({ message: 'Пользователь разблокирован' });

            case 'delete':
                // Проверяем роль пользователя
                const [users] = await pool.query(
                    'SELECT role FROM users WHERE id = ?',
                    [userId]
                );

                if ((users as any[]).length === 0) {
                    return res.status(404).json({ message: 'Пользователь не найден' });
                }

                const userRole = (users as any[])[0].role;

                // Удаляем связанные записи в зависимости от роли
                switch (userRole) {
                    case 'doctor':
                        await pool.query('DELETE FROM doctors WHERE user_id = ?', [userId]);
                        break;
                    case 'patient':
                        await pool.query('DELETE FROM patients WHERE user_id = ?', [userId]);
                        break;
                }

                // Удаляем пользователя
                await pool.query('DELETE FROM users WHERE id = ?', [userId]);
                return res.json({ message: 'Пользователь удален' });

            default:
                return res.status(400).json({ message: 'Неизвестное действие' });
        }
    } catch (error) {
        console.error('Ошибка при управлении пользователями:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Получение статистики
export const getStatistics = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { period } = req.query; // day, week, month, year
        
        // Определяем временной интервал
        let dateInterval;
        switch (period) {
            case 'day':
                dateInterval = 'INTERVAL 1 DAY';
                break;
            case 'week':
                dateInterval = 'INTERVAL 1 WEEK';
                break;
            case 'month':
                dateInterval = 'INTERVAL 1 MONTH';
                break;
            case 'year':
                dateInterval = 'INTERVAL 1 YEAR';
                break;
            default:
                dateInterval = 'INTERVAL 1 MONTH';
        }

        // Получаем статистику по записям
        const [appointmentsStats] = await pool.query<RowDataPacket[]>(
            `
            SELECT 
                COUNT(*) as total_appointments,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_appointments,
                SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) as canceled_appointments,
                SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) as no_show_appointments
            FROM appointments a
            JOIN time_slots ts ON a.time_slot_id = ts.id
            WHERE ts.date >= DATE_SUB(CURRENT_DATE, ${dateInterval})
        `
        );

        // Получаем статистику по врачам
        const [doctorsStats] = await pool.query<RowDataPacket[]>(
            `
            SELECT 
                COUNT(DISTINCT d.id) as total_doctors,
                COUNT(DISTINCT CASE WHEN d.is_accepting_patients = TRUE THEN d.id END) as active_doctors,
                AVG(d.consultation_fee) as average_consultation_fee
            FROM doctors d
        `
        );

        // Получаем статистику по пациентам
        const [patientsStats] = await pool.query<RowDataPacket[]>(
            `
            SELECT COUNT(*) as total_patients
            FROM patients p
            JOIN users u ON p.user_id = u.id
            WHERE u.is_active = TRUE
        `
        );

        // Получаем топ специализаций по количеству записей
        const [topSpecializations] = await pool.query<RowDataPacket[]>(
            `
            SELECT 
                s.name,
                COUNT(*) as appointment_count
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            JOIN specializations s ON d.specialization_id = s.id
            JOIN time_slots ts ON a.time_slot_id = ts.id
            WHERE ts.date >= DATE_SUB(CURRENT_DATE, ${dateInterval})
            GROUP BY s.id
            ORDER BY appointment_count DESC
            LIMIT 5
        `
        );

        return res.json({
            appointments: appointmentsStats[0],
            doctors: doctorsStats[0],
            patients: patientsStats[0],
            topSpecializations
        });
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

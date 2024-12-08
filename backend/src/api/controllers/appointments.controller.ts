import { Request, Response } from 'express';
import { pool } from '../../config/database';
import { AuthRequest } from '../../types';
import { AppointmentRow, TimeSlotRow, DoctorRow } from '../../types/database';

// Создание записи на прием
export const createAppointment = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { doctorId, timeSlotId, appointmentType, reasonForVisit, symptoms } = req.body;
        const patientId = req.user?.id;

        // Проверяем права доступа
        if (req.user?.role !== 'patient') {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        // Проверяем доступность временного слота
        const [slots] = await pool.query<TimeSlotRow[]>(
            'SELECT id FROM time_slots WHERE id = ? AND doctor_id = ? AND is_available = TRUE',
            [timeSlotId, doctorId]
        );

        if (!slots || slots.length === 0) {
            return res.status(400).json({ message: 'Выбранное время недоступно' });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Создаем запись на прием
            const [result] = await connection.query(
                `INSERT INTO appointments (
                    patient_id, doctor_id, time_slot_id, appointment_type,
                    status, reason_for_visit, symptoms, created_by
                ) VALUES (?, ?, ?, ?, 'scheduled', ?, ?, ?)`,
                [patientId, doctorId, timeSlotId, appointmentType, reasonForVisit, symptoms, patientId]
            );

            // Помечаем временной слот как занятый
            await connection.query(
                'UPDATE time_slots SET is_available = FALSE WHERE id = ?',
                [timeSlotId]
            );

            await connection.commit();

            return res.status(201).json({
                message: 'Запись на прием успешно создана',
                appointmentId: (result as any).insertId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Ошибка при создании записи на прием:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Получение списка записей на прием
export const getAppointments = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;

        let query = '';
        const queryParams: any[] = [];

        if (userRole === 'patient') {
            query = `
                SELECT 
                    a.*,
                    d.specialization_id,
                    s.name as specialization_name,
                    u.first_name as doctor_first_name,
                    u.last_name as doctor_last_name,
                    u.middle_name as doctor_middle_name
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.id
                JOIN specializations s ON d.specialization_id = s.id
                JOIN users u ON d.user_id = u.id
                WHERE a.patient_id = (SELECT id FROM patients WHERE user_id = ?)
                ORDER BY a.date DESC, a.start_time DESC
            `;
            queryParams.push(userId);
        } else if (userRole === 'doctor') {
            query = `
                SELECT 
                    a.*,
                    u.first_name as patient_first_name,
                    u.last_name as patient_last_name,
                    u.middle_name as patient_middle_name
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                JOIN users u ON p.user_id = u.id
                WHERE a.doctor_id = (SELECT id FROM doctors WHERE user_id = ?)
                ORDER BY a.date DESC, a.start_time DESC
            `;
            queryParams.push(userId);
        } else {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const [appointments] = await pool.query<AppointmentRow[]>(query, queryParams);
        return res.json(appointments);
    } catch (error) {
        console.error('Ошибка при получении списка приемов:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Получение деталей приема
export const getAppointmentDetails = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        let query = '';
        const queryParams: any[] = [];

        if (userRole === 'patient') {
            query = `
                SELECT 
                    a.*,
                    d.specialization_id,
                    s.name as specialization_name,
                    u.first_name as doctor_first_name,
                    u.last_name as doctor_last_name,
                    u.middle_name as doctor_middle_name
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.id
                JOIN specializations s ON d.specialization_id = s.id
                JOIN users u ON d.user_id = u.id
                WHERE a.id = ? 
                AND a.patient_id = (SELECT id FROM patients WHERE user_id = ?)
            `;
            queryParams.push(appointmentId, userId);
        } else if (userRole === 'doctor') {
            query = `
                SELECT 
                    a.*,
                    u.first_name as patient_first_name,
                    u.last_name as patient_last_name,
                    u.middle_name as patient_middle_name
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                JOIN users u ON p.user_id = u.id
                WHERE a.id = ?
                AND a.doctor_id = (SELECT id FROM doctors WHERE user_id = ?)
            `;
            queryParams.push(appointmentId, userId);
        } else {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const [appointments] = await pool.query<AppointmentRow[]>(query, queryParams);

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: 'Прием не найден' });
        }

        return res.json(appointments[0]);
    } catch (error) {
        console.error('Ошибка при получении информации о приеме:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Получение списка записей пациента
export const getPatientAppointments = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;
        const { status } = req.query;

        let statusFilter = '';
        if (status) {
            statusFilter = 'AND a.status = ?';
        }

        const [rows] = await pool.query(`
            SELECT 
                a.id,
                a.appointment_type,
                a.status,
                a.reason_for_visit,
                a.created_at,
                ts.date,
                ts.start_time,
                ts.end_time,
                d.id as doctor_id,
                u.first_name as doctor_first_name,
                u.last_name as doctor_last_name,
                s.name as specialization
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN time_slots ts ON a.time_slot_id = ts.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            JOIN specializations s ON d.specialization_id = s.id
            WHERE p.user_id = ? ${statusFilter}
            ORDER BY ts.date DESC, ts.start_time DESC
        `, status ? [userId, status] : [userId]);

        return res.json(rows);
    } catch (error) {
        console.error('Ошибка при получении списка записей:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Отмена записи на прием
export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { cancellationReason } = req.body;
        const userId = req.user?.id;

        // Проверяем существование записи и права на её отмену
        const [appointments] = await pool.query(`
            SELECT 
                a.id,
                a.status,
                a.time_slot_id,
                p.user_id as patient_id,
                d.user_id as doctor_id
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.id = ?
        `, [id]);

        if (!appointments || (appointments as any[]).length === 0) {
            return res.status(404).json({ message: 'Запись не найдена' });
        }

        const appointment = (appointments as any[])[0];

        // Проверяем, что запись может быть отменена
        if (appointment.status !== 'scheduled' && appointment.status !== 'confirmed') {
            return res.status(400).json({ message: 'Невозможно отменить эту запись' });
        }

        // Проверяем права на отмену
        if (appointment.patient_id !== userId && appointment.doctor_id !== userId) {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        // Отменяем запись
        await pool.query(
            `UPDATE appointments 
            SET status = 'canceled', cancellation_reason = ?, canceled_by = ?
            WHERE id = ?`,
            [cancellationReason, userId, id]
        );

        // Освобождаем временной слот
        await pool.query(
            'UPDATE time_slots SET is_available = TRUE WHERE id = ?',
            [appointment.time_slot_id]
        );

        // Создаем уведомления
        const notifyUserId = userId === appointment.patient_id
            ? appointment.doctor_id
            : appointment.patient_id;

        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id)
            VALUES (?, 'appointment', 'Отмена записи', 'Запись на прием была отменена', 'appointment', ?)`,
            [notifyUserId, id]
        );

        return res.json({ message: 'Запись успешно отменена' });
    } catch (error) {
        console.error('Ошибка при отмене записи:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

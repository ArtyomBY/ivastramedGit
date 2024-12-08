import { Request, Response } from 'express';
import { pool } from '../../config/database';
import { AuthRequest } from '../../types';
import { PatientRow, AppointmentRow } from '../../types/database';

// Получение профиля пациента
export const getPatientProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;

        const [rows] = await pool.query<PatientRow[]>(`
            SELECT 
                u.first_name,
                u.last_name,
                u.middle_name,
                u.email,
                u.phone,
                u.passport,
                u.oms,
                u.address,
                u.birth_date,
                u.gender,
                p.medical_record_number,
                p.blood_type,
                p.allergies,
                p.chronic_diseases,
                p.emergency_contact_name,
                p.emergency_contact_phone
            FROM users u
            JOIN patients p ON u.id = p.user_id
            WHERE u.id = ? AND u.is_active = TRUE
        `, [userId]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Профиль не найден' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('Ошибка при получении профиля пациента:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Обновление профиля пациента
export const updatePatientProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;
        const {
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

        // Начинаем транзакцию
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Обновляем данные пользователя
            await connection.query(`
                UPDATE users 
                SET 
                    first_name = ?,
                    last_name = ?,
                    middle_name = ?,
                    phone = ?,
                    passport = ?,
                    oms = ?,
                    address = ?,
                    birth_date = ?,
                    gender = ?
                WHERE id = ?
            `, [
                firstName,
                lastName,
                middleName,
                phone,
                passport,
                oms,
                address,
                birthDate,
                gender,
                userId
            ]);

            // Обновляем данные пациента
            await connection.query(`
                UPDATE patients 
                SET 
                    blood_type = ?,
                    allergies = ?,
                    chronic_diseases = ?,
                    emergency_contact_name = ?,
                    emergency_contact_phone = ?
                WHERE user_id = ?
            `, [
                bloodType,
                allergies,
                chronicDiseases,
                emergencyContactName,
                emergencyContactPhone,
                userId
            ]);

            await connection.commit();
            return res.json({ message: 'Профиль успешно обновлен' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Ошибка при обновлении профиля пациента:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Получение медицинской карты пациента
export const getPatientMedicalHistory = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;

        // Получаем историю приемов
        const [appointments] = await pool.query<AppointmentRow[]>(`
            SELECT 
                a.id,
                a.appointment_type,
                a.status,
                a.reason_for_visit,
                a.symptoms,
                a.diagnosis,
                a.treatment_notes,
                a.prescription,
                a.created_at,
                ts.date,
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
            WHERE p.user_id = ? AND a.status = 'completed'
            ORDER BY ts.date DESC
        `, [userId]);

        return res.json({
            appointments
        });
    } catch (error) {
        console.error('Ошибка при получении медицинской карты:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

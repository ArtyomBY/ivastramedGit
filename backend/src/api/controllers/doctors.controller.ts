import { Request, Response } from 'express';
import { pool } from '../../config/database';
import { DoctorRow, TimeSlotRow, SpecializationRow } from '../../types/database';

// Получение списка врачей
export const getDoctors = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            specializationId, 
            isAcceptingPatients,
            searchQuery,
            page = 1,
            limit = 20
        } = req.query;

        let query = `
            SELECT 
                d.*,
                u.first_name,
                u.last_name,
                u.middle_name,
                u.phone,
                s.name as specialization_name,
                s.description as specialization_description
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            JOIN specializations s ON d.specialization_id = s.id
            WHERE u.is_active = TRUE
        `;

        const queryParams: any[] = [];

        if (specializationId) {
            query += ' AND d.specialization_id = ?';
            queryParams.push(specializationId);
        }

        if (isAcceptingPatients === 'true') {
            query += ' AND d.is_accepting_patients = TRUE';
        }

        if (searchQuery) {
            query += ` AND (
                u.first_name LIKE ? OR 
                u.last_name LIKE ? OR 
                u.middle_name LIKE ? OR
                s.name LIKE ?
            )`;
            const searchTerm = `%${searchQuery}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Добавляем пагинацию
        const offset = (Number(page) - 1) * Number(limit);
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(Number(limit), offset);

        const [doctors] = await pool.query<DoctorRow[]>(query, queryParams);

        // Получаем общее количество для пагинации
        const [totalCount] = await pool.query<any[]>(
            'SELECT COUNT(*) as total FROM doctors d JOIN users u ON d.user_id = u.id JOIN specializations s ON d.specialization_id = s.id WHERE u.is_active = TRUE'
        );
        const total = totalCount[0].total;

        res.json({
            doctors,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: total
            }
        });
    } catch (error) {
        console.error('Ошибка при получении списка врачей:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Получение информации о враче
export const getDoctorDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { doctorId } = req.params;

        const [doctors] = await pool.query<DoctorRow[]>(`
            SELECT 
                d.*,
                u.first_name,
                u.last_name,
                u.middle_name,
                u.phone,
                s.name as specialization_name,
                s.description as specialization_description
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            JOIN specializations s ON d.specialization_id = s.id
            WHERE d.id = ? AND u.is_active = TRUE
        `, [doctorId]);

        if (!doctors || doctors.length === 0) {
            res.status(404).json({ message: 'Врач не найден' });
            return;
        }

        // Получаем расписание врача на ближайшую неделю
        const [timeSlots] = await pool.query<TimeSlotRow[]>(`
            SELECT *
            FROM time_slots
            WHERE doctor_id = ? 
            AND date >= CURRENT_DATE 
            AND date <= DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)
            AND is_available = TRUE
            ORDER BY date, start_time
        `, [doctorId]);

        res.json({
            ...doctors[0],
            availableTimeSlots: timeSlots
        });
    } catch (error) {
        console.error('Ошибка при получении информации о враче:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Получение специализаций
export const getSpecializations = async (req: Request, res: Response): Promise<void> => {
    try {
        const [specializations] = await pool.query<SpecializationRow[]>(
            'SELECT * FROM specializations ORDER BY name'
        );

        res.json(specializations);
    } catch (error) {
        console.error('Ошибка при получении специализаций:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

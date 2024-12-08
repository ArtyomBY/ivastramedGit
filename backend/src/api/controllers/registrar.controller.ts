import { Request, Response } from 'express';
import { pool } from '../../config/database';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../../types';

// Создание записи на прием от имени пациента
export const createAppointmentForPatient = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { 
            patientId, 
            doctorId, 
            timeSlotId, 
            appointmentType, 
            reasonForVisit, 
            symptoms 
        } = req.body;
        const registrarId = req.user?.id;

        // Проверяем права доступа
        if (req.user?.role !== 'registrar') {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        // Проверяем существование пациента
        const [patientExists] = await pool.query(
            'SELECT id FROM patients WHERE id = ?',
            [patientId]
        );

        if (!patientExists || (patientExists as any[]).length === 0) {
            return res.status(404).json({ message: 'Пациент не найден' });
        }

        // Проверяем доступность временного слота
        const [slots] = await pool.query(
            'SELECT id FROM time_slots WHERE id = ? AND doctor_id = ? AND is_available = TRUE',
            [timeSlotId, doctorId]
        );

        if (!slots || (slots as any[]).length === 0) {
            return res.status(400).json({ message: 'Выбранное время недоступно' });
        }

        // Создаем запись на прием
        const [result] = await pool.query(
            `INSERT INTO appointments (
                patient_id, doctor_id, time_slot_id, appointment_type,
                status, reason_for_visit, symptoms, created_by
            ) VALUES (?, ?, ?, ?, 'scheduled', ?, ?, ?)`,
            [patientId, doctorId, timeSlotId, appointmentType, reasonForVisit, symptoms, registrarId]
        );

        // Помечаем временной слот как занятый
        await pool.query(
            'UPDATE time_slots SET is_available = FALSE WHERE id = ?',
            [timeSlotId]
        );

        // Создаем уведомления для пациента и врача
        const [patientUser] = await pool.query(
            'SELECT user_id FROM patients WHERE id = ?',
            [patientId]
        );
        const [doctorUser] = await pool.query(
            'SELECT user_id FROM doctors WHERE id = ?',
            [doctorId]
        );

        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id)
            VALUES (?, 'appointment', 'Новая запись на прием', 'Для вас создана новая запись на прием', 'appointment', ?)`,
            [(patientUser as any[])[0].user_id, (result as any).insertId]
        );

        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id)
            VALUES (?, 'appointment', 'Новая запись на прием', 'К вам записан новый пациент', 'appointment', ?)`,
            [(doctorUser as any[])[0].user_id, (result as any).insertId]
        );

        return res.status(201).json({
            message: 'Запись на прием успешно создана',
            appointmentId: (result as any).insertId
        });
    } catch (error) {
        console.error('Ошибка при создании записи на прием:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Регистрация нового пациента
export const registerNewPatient = async (req: AuthRequest, res: Response): Promise<Response> => {
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

        // Проверяем права доступа
        if (req.user?.role !== 'registrar') {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        // Проверяем, не занят ли email
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if ((existingUsers as any[]).length > 0) {
            return res.status(400).json({
                message: 'Пользователь с таким email уже существует'
            });
        }

        // Начинаем транзакцию
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
                    address, birth_date, gender, role, verified
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'patient', TRUE)`,
                [email, passwordHash, firstName, lastName, middleName, phone, 
                 passport, oms, address, birthDate, gender]
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

            return res.status(201).json({
                message: 'Пациент успешно зарегистрирован',
                patientId: (patientResult as any).insertId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Ошибка при регистрации пациента:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Управление расписанием врачей
export const manageDoctorSchedule = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { doctorId } = req.params;
        const { 
            scheduleTemplates,
            scheduleExceptions,
            generateTimeSlots = true,
            startDate,
            endDate
        } = req.body;

        // Проверяем права доступа
        if (req.user?.role !== 'registrar') {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Обновляем шаблоны расписания
            if (scheduleTemplates) {
                // Деактивируем старые шаблоны
                await connection.query(
                    'UPDATE doctor_schedule_templates SET is_active = FALSE WHERE doctor_id = ?',
                    [doctorId]
                );

                // Добавляем новые шаблоны
                for (const template of scheduleTemplates) {
                    await connection.query(
                        `INSERT INTO doctor_schedule_templates (
                            doctor_id, day_of_week, start_time, end_time,
                            break_start, break_end, appointment_duration
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [doctorId, template.dayOfWeek, template.startTime,
                         template.endTime, template.breakStart, template.breakEnd,
                         template.appointmentDuration]
                    );
                }
            }

            // Добавляем исключения в расписание
            if (scheduleExceptions) {
                for (const exception of scheduleExceptions) {
                    await connection.query(
                        `INSERT INTO doctor_schedule_exceptions (
                            doctor_id, exception_date, is_working_day,
                            start_time, end_time, reason
                        ) VALUES (?, ?, ?, ?, ?, ?)`,
                        [doctorId, exception.date, exception.isWorkingDay,
                         exception.startTime, exception.endTime, exception.reason]
                    );
                }
            }

            // Генерируем временные слоты если требуется
            if (generateTimeSlots && startDate && endDate) {
                // Получаем шаблоны расписания
                const [templates] = await connection.query(
                    `SELECT * FROM doctor_schedule_templates 
                    WHERE doctor_id = ? AND is_active = TRUE`,
                    [doctorId]
                );

                // Получаем исключения
                const [exceptions] = await connection.query(
                    `SELECT * FROM doctor_schedule_exceptions 
                    WHERE doctor_id = ? AND exception_date BETWEEN ? AND ?`,
                    [doctorId, startDate, endDate]
                );

                // Генерируем слоты на основе шаблонов и исключений
                // Здесь должна быть логика генерации слотов
                // ...

                // Сохраняем сгенерированные слоты
                // ...
            }

            await connection.commit();
            return res.json({ message: 'Расписание успешно обновлено' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Ошибка при управлении расписанием:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Поиск и просмотр записей на прием
export const searchAppointments = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { 
            doctorId,
            patientId,
            status,
            dateFrom,
            dateTo,
            page = 1,
            limit = 20
        } = req.query;

        // Проверяем права доступа
        if (req.user?.role !== 'registrar') {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }

        let whereConditions = [];
        let queryParams = [];

        if (doctorId) {
            whereConditions.push('a.doctor_id = ?');
            queryParams.push(doctorId);
        }
        if (patientId) {
            whereConditions.push('a.patient_id = ?');
            queryParams.push(patientId);
        }
        if (status) {
            whereConditions.push('a.status = ?');
            queryParams.push(status);
        }
        if (dateFrom) {
            whereConditions.push('ts.date >= ?');
            queryParams.push(dateFrom);
        }
        if (dateTo) {
            whereConditions.push('ts.date <= ?');
            queryParams.push(dateTo);
        }

        const whereClause = whereConditions.length > 0 
            ? 'WHERE ' + whereConditions.join(' AND ')
            : '';

        const offset = (Number(page) - 1) * Number(limit);
        queryParams.push(Number(limit), offset);

        // Получаем записи
        const [appointments] = await pool.query(`
            SELECT 
                a.id,
                a.appointment_type,
                a.status,
                a.reason_for_visit,
                a.symptoms,
                a.created_at,
                ts.date,
                ts.start_time,
                ts.end_time,
                d.id as doctor_id,
                du.first_name as doctor_first_name,
                du.last_name as doctor_last_name,
                s.name as specialization,
                p.id as patient_id,
                pu.first_name as patient_first_name,
                pu.last_name as patient_last_name,
                pu.phone as patient_phone
            FROM appointments a
            JOIN time_slots ts ON a.time_slot_id = ts.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users du ON d.user_id = du.id
            JOIN specializations s ON d.specialization_id = s.id
            JOIN patients p ON a.patient_id = p.id
            JOIN users pu ON p.user_id = pu.id
            ${whereClause}
            ORDER BY ts.date DESC, ts.start_time DESC
            LIMIT ? OFFSET ?
        `, queryParams);

        // Получаем общее количество записей
        const [totalCount] = await pool.query(`
            SELECT COUNT(*) as total
            FROM appointments a
            JOIN time_slots ts ON a.time_slot_id = ts.id
            ${whereClause}
        `, queryParams.slice(0, -2));

        return res.json({
            appointments,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: (totalCount as any[])[0].total
            }
        });
    } catch (error) {
        console.error('Ошибка при поиске записей:', error);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

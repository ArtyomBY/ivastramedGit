-- Очистка существующих данных
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE messages;
TRUNCATE TABLE chats;
TRUNCATE TABLE appointments;
TRUNCATE TABLE time_slots;
TRUNCATE TABLE disease_history;
TRUNCATE TABLE examination_results;
TRUNCATE TABLE medical_documents;
TRUNCATE TABLE medical_records;
TRUNCATE TABLE doctors;
TRUNCATE TABLE patients;
TRUNCATE TABLE specializations;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Добавление тестовых специализаций
INSERT INTO specializations (name, description, default_appointment_duration) VALUES
('Терапевт', 'Врач общей практики', 30),
('Кардиолог', 'Специалист по сердечно-сосудистой системе', 45),
('Невролог', 'Специалист по нервной системе', 40),
('Офтальмолог', 'Специалист по глазным болезням', 30),
('Хирург', 'Специалист по хирургическим вмешательствам', 60);

-- Добавление тестовых данных для всех типов пользователей
INSERT INTO users (email, password_hash, first_name, last_name, middle_name, phone, role, verified) VALUES
('admin@example.com', '$2a$10$6CneXIXqB7e64kGjc.glsOQrlb7z23dzj0OTyOxTbAhvJQ.CaAfXm', 'Андрей', 'Администратов', 'Андреевич', '+7(999)111-11-11', 'admin', true),
('doctor@example.com', '$2a$10$KuY6MXFOIgR/oY40utMfOe.Ckjaff5g2ThA/x.iT6Q4pcRpupiKja', 'Дмитрий', 'Докторов', 'Дмитриевич', '+7(999)222-22-22', 'doctor', true),
('patient@example.com', '$2a$10$KIPKRs1qYdQGSfqSK3Aggeh/McQ/EtROgUYmsJ/ujqxSSrqU4oxVS', 'Петр', 'Пациентов', 'Петрович', '+7(999)333-33-33', 'patient', true),
('registrar@example.com', '$2a$10$aJq8ItzOX5JdFxqnPkQAruF42.COayGZFf4McBJKxtTbYObdiPHpe', 'Регина', 'Регистраторова', 'Романовна', '+7(999)444-44-44', 'registrar', true),
('admin2@example.com', '$2a$10$JsbJV5zqAeZI58qZcbUft.sarU1LkX3zu4hvdT./QCujAK5hH5lJK', 'Алексей', 'Администратов', 'Алексеевич', '+7(999)555-55-55', 'admin', true),
('doctor2@example.com', '$2a$10$lVFch7OOvlHO2wSe48Z9k.zQGbLEEA3mpiM0uuN0njRqjzasvrkuK', 'Иван', 'Докторов', 'Иванович', '+7(999)666-66-66', 'doctor', true),
('patient2@example.com', '$2a$10$ocWNxNCYSqSEO.lFsWrHP.UI.4R7ed62eZyXtjKQG2yTH7Ugw6N06', 'Сергей', 'Пациентов', 'Сергеевич', '+7(999)777-77-77', 'patient', true),
('registrar2@example.com', '$2a$10$6jM7.1R8dVvak4WEWjc9AO/BAOjB1CHMiMxF/n1s9jWBTzHKm9nYe', 'Елена', 'Регистраторова', 'Евгеньевна', '+7(999)888-88-88', 'registrar', true);

-- Обновление паролей для тестовых пользователей
UPDATE users SET password_hash = '$2a$10$6CneXIXqB7e64kGjc.glsOQrlb7z23dzj0OTyOxTbAhvJQ.CaAfXm' WHERE email = 'admin@example.com';
UPDATE users SET password_hash = '$2a$10$KuY6MXFOIgR/oY40utMfOe.Ckjaff5g2ThA/x.iT6Q4pcRpupiKja' WHERE email = 'doctor@example.com';
UPDATE users SET password_hash = '$2a$10$KIPKRs1qYdQGSfqSK3Aggeh/McQ/EtROgUYmsJ/ujqxSSrqU4oxVS' WHERE email = 'patient@example.com';
UPDATE users SET password_hash = '$2a$10$aJq8ItzOX5JdFxqnPkQAruF42.COayGZFf4McBJKxtTbYObdiPHpe' WHERE email = 'registrar@example.com';
UPDATE users SET password_hash = '$2a$10$JsbJV5zqAeZI58qZcbUft.sarU1LkX3zu4hvdT./QCujAK5hH5lJK' WHERE email = 'admin2@example.com';
UPDATE users SET password_hash = '$2a$10$lVFch7OOvlHO2wSe48Z9k.zQGbLEEA3mpiM0uuN0njRqjzasvrkuK' WHERE email = 'doctor2@example.com';
UPDATE users SET password_hash = '$2a$10$ocWNxNCYSqSEO.lFsWrHP.UI.4R7ed62eZyXtjKQG2yTH7Ugw6N06' WHERE email = 'patient2@example.com';

-- Добавление данных врача
INSERT INTO doctors (user_id, specialization_id, license_number, experience_years, office_number) 
SELECT u.id, s.id, 'LIC123456', 10, '101'
FROM users u, specializations s
WHERE u.email = 'doctor@example.com' AND s.name = 'Терапевт';

-- Добавление данных врача
INSERT INTO doctors (user_id, specialization_id, license_number, experience_years, office_number) 
SELECT u.id, s.id, 'LIC789012', 5, '102'
FROM users u, specializations s
WHERE u.email = 'doctor2@example.com' AND s.name = 'Кардиолог';

-- Добавление данных пациента
INSERT INTO patients (user_id, blood_type, allergies, chronic_diseases)
SELECT id, 'A+', 'Нет', 'Нет'
FROM users
WHERE email = 'patient@example.com';

-- Добавление данных пациента
INSERT INTO patients (user_id, blood_type, allergies, chronic_diseases)
SELECT id, 'B+', 'Нет', 'Нет'
FROM users
WHERE email = 'patient2@example.com';

-- Создание медицинской карты для пациента
INSERT INTO medical_records (patient_id, created_at, updated_at)
SELECT p.id, NOW(), NOW()
FROM patients p
JOIN users u ON p.user_id = u.id
WHERE u.email = 'patient@example.com';

-- Создание медицинской карты для пациента
INSERT INTO medical_records (patient_id, created_at, updated_at)
SELECT p.id, NOW(), NOW()
FROM patients p
JOIN users u ON p.user_id = u.id
WHERE u.email = 'patient2@example.com';

-- Добавление истории болезней
INSERT INTO disease_history (medical_record_id, diagnosis, start_date, end_date, symptoms, treatment, doctor_id, status)
SELECT 
  mr.id,
  'Острый бронхит',
  '2023-11-01',
  '2023-11-15',
  'Кашель, повышенная температура',
  'Антибиотики, отхаркивающие средства',
  d.id,
  'resolved'
FROM medical_records mr
JOIN patients p ON mr.patient_id = p.id
JOIN users u ON p.user_id = u.id
JOIN doctors d ON d.user_id = u.id
WHERE u.email = 'patient@example.com' AND d.user_id = (SELECT id FROM users WHERE email = 'doctor@example.com');

-- Добавление истории болезней
INSERT INTO disease_history (medical_record_id, diagnosis, start_date, end_date, symptoms, treatment, doctor_id, status)
SELECT 
  mr.id,
  'Грипп',
  '2023-12-01',
  '2023-12-15',
  'Повышенная температура, кашель',
  'Антибиотики, противовирусные препараты',
  d.id,
  'resolved'
FROM medical_records mr
JOIN patients p ON mr.patient_id = p.id
JOIN users u ON p.user_id = u.id
JOIN doctors d ON d.user_id = u.id
WHERE u.email = 'patient2@example.com' AND d.user_id = (SELECT id FROM users WHERE email = 'doctor2@example.com');

-- Добавление результатов исследований
INSERT INTO examination_results (medical_record_id, examination_type, examination_date, result, doctor_id)
SELECT 
  mr.id,
  'Общий анализ крови',
  '2023-11-02',
  'Все показатели в норме',
  d.id
FROM medical_records mr
JOIN patients p ON mr.patient_id = p.id
JOIN users u ON p.user_id = u.id
JOIN doctors d ON d.user_id = u.id
WHERE u.email = 'patient@example.com' AND d.user_id = (SELECT id FROM users WHERE email = 'doctor@example.com');

-- Добавление результатов исследований
INSERT INTO examination_results (medical_record_id, examination_type, examination_date, result, doctor_id)
SELECT 
  mr.id,
  'Общий анализ крови',
  '2023-12-02',
  'Все показатели в норме',
  d.id
FROM medical_records mr
JOIN patients p ON mr.patient_id = p.id
JOIN users u ON p.user_id = u.id
JOIN doctors d ON d.user_id = u.id
WHERE u.email = 'patient2@example.com' AND d.user_id = (SELECT id FROM users WHERE email = 'doctor2@example.com');

-- Добавление документов
INSERT INTO medical_documents (medical_record_id, document_type, document_number, issue_date, issuing_authority, document_path)
SELECT 
  mr.id,
  'Справка о временной нетрудоспособности',
  '123456',
  '2023-11-01',
  'Городская поликлиника №1',
  '/documents/sick_leave_123456.pdf'
FROM medical_records mr
JOIN patients p ON mr.patient_id = p.id
JOIN users u ON p.user_id = u.id
WHERE u.email = 'patient@example.com';

-- Добавление документов
INSERT INTO medical_documents (medical_record_id, document_type, document_number, issue_date, issuing_authority, document_path)
SELECT 
  mr.id,
  'Справка о временной нетрудоспособности',
  '789012',
  '2023-12-01',
  'Городская поликлиника №2',
  '/documents/sick_leave_789012.pdf'
FROM medical_records mr
JOIN patients p ON mr.patient_id = p.id
JOIN users u ON p.user_id = u.id
WHERE u.email = 'patient2@example.com';

-- Добавление тестовых временных слотов
INSERT INTO time_slots (doctor_id, date, start_time, end_time, is_available) VALUES
((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor@example.com'),
 DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)), '10:00:00', '10:30:00', FALSE);

-- Добавление тестовых временных слотов
INSERT INTO time_slots (doctor_id, date, start_time, end_time, is_available) VALUES
((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@example.com'),
 DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY)), '11:00:00', '11:30:00', FALSE);

-- Добавление тестовых записей на прием
INSERT INTO appointments (patient_id, doctor_id, time_slot_id, appointment_type, status, reason_for_visit, created_by) VALUES
((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient@example.com'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor@example.com'),
 (SELECT ts.id FROM time_slots ts 
  JOIN doctors d ON ts.doctor_id = d.id 
  JOIN users u ON d.user_id = u.id 
  WHERE u.email = 'doctor@example.com' AND DATE(ts.date) = DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY))),
 'first_visit', 'scheduled', 'Головная боль',
 (SELECT id FROM users WHERE email = 'registrar@example.com'));

-- Добавление тестовых записей на прием
INSERT INTO appointments (patient_id, doctor_id, time_slot_id, appointment_type, status, reason_for_visit, created_by) VALUES
((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient2@example.com'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@example.com'),
 (SELECT ts.id FROM time_slots ts 
  JOIN doctors d ON ts.doctor_id = d.id 
  JOIN users u ON d.user_id = u.id 
  WHERE u.email = 'doctor2@example.com' AND DATE(ts.date) = DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY))),
 'first_visit', 'scheduled', 'Болит горло',
 (SELECT id FROM users WHERE email = 'registrar2@example.com'));

-- Добавление тестовых чатов
INSERT INTO chats (patient_id, doctor_id, created_at) VALUES
((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient@example.com'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor@example.com'),
 CURRENT_TIMESTAMP);

-- Добавление тестовых чатов
INSERT INTO chats (patient_id, doctor_id, created_at) VALUES
((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient2@example.com'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@example.com'),
 CURRENT_TIMESTAMP);

-- Добавление тестовых сообщений
INSERT INTO messages (chat_id, sender_id, message, message_type) VALUES
((SELECT c.id FROM chats c 
  JOIN patients p ON c.patient_id = p.id 
  JOIN users u ON p.user_id = u.id 
  WHERE u.email = 'patient@example.com'),
 (SELECT id FROM users WHERE email = 'patient@example.com'),
 'Здравствуйте, доктор! У меня есть вопрос по лечению.',
 'text'),
 
((SELECT c.id FROM chats c 
  JOIN patients p ON c.patient_id = p.id 
  JOIN users u ON p.user_id = u.id 
  WHERE u.email = 'patient@example.com'),
 (SELECT u.id FROM users u 
  JOIN doctors d ON u.id = d.user_id 
  WHERE u.email = 'doctor@example.com'),
 'Здравствуйте! Да, конечно, слушаю вас.',
 'text'),

((SELECT c.id FROM chats c 
  JOIN patients p ON c.patient_id = p.id 
  JOIN users u ON p.user_id = u.id 
  WHERE u.email = 'patient2@example.com'),
 (SELECT id FROM users WHERE email = 'patient2@example.com'),
 'Здравствуйте, доктор! У меня есть вопрос по лечению.',
 'text'),
 
((SELECT c.id FROM chats c 
  JOIN patients p ON c.patient_id = p.id 
  JOIN users u ON p.user_id = u.id 
  WHERE u.email = 'patient2@example.com'),
 (SELECT u.id FROM users u 
  JOIN doctors d ON u.id = d.user_id 
  WHERE u.email = 'doctor2@example.com'),
 'Здравствуйте! Да, конечно, слушаю вас.',
 'text');

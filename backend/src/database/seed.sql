-- Очистка существующих данных
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE messages;
TRUNCATE TABLE chats;
TRUNCATE TABLE appointments;
TRUNCATE TABLE time_slots;
TRUNCATE TABLE patients;
TRUNCATE TABLE doctors;
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

-- Добавление тестового администратора
INSERT INTO users (email, password_hash, first_name, last_name, role, verified) VALUES
('admin@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Администратор', 'Системы', 'admin', TRUE);

-- Добавление тестовых регистраторов
INSERT INTO users (email, password_hash, first_name, last_name, role, verified) VALUES
('registrar1@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Анна', 'Регистратор', 'registrar', TRUE),
('registrar2@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Ольга', 'Регистратор', 'registrar', TRUE);

-- Добавление тестовых врачей
INSERT INTO users (email, password_hash, first_name, last_name, middle_name, phone, role, verified) VALUES
('doctor1@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Иван', 'Петров', 'Сергеевич', '+79001234567', 'doctor', TRUE),
('doctor2@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Елена', 'Иванова', 'Александровна', '+79001234568', 'doctor', TRUE),
('doctor3@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Михаил', 'Сидоров', 'Петрович', '+79001234569', 'doctor', TRUE),
('doctor4@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Ольга', 'Козлова', 'Ивановна', '+79001234570', 'doctor', TRUE),
('doctor5@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Дмитрий', 'Новиков', 'Александрович', '+79001234571', 'doctor', TRUE);

-- Связывание врачей со специализациями
INSERT INTO doctors (user_id, specialization_id, license_number, experience_years, office_number, consultation_fee) VALUES
((SELECT id FROM users WHERE email = 'doctor1@ivastrameds.ru'), 1, 'LIC123456', 10, '101', 1500.00),
((SELECT id FROM users WHERE email = 'doctor2@ivastrameds.ru'), 2, 'LIC123457', 15, '102', 2000.00),
((SELECT id FROM users WHERE email = 'doctor3@ivastrameds.ru'), 3, 'LIC123458', 8, '103', 1800.00),
((SELECT id FROM users WHERE email = 'doctor4@ivastrameds.ru'), 4, 'LIC123459', 12, '104', 1700.00),
((SELECT id FROM users WHERE email = 'doctor5@ivastrameds.ru'), 5, 'LIC123460', 20, '105', 2500.00);

-- Добавление тестовых пациентов
INSERT INTO users (email, password_hash, first_name, last_name, middle_name, phone, role, verified) VALUES
('patient1@mail.ru', '$2b$10$YourHashedPasswordHere', 'Алексей', 'Смирнов', 'Иванович', '+79011234569', 'patient', TRUE),
('patient2@mail.ru', '$2b$10$YourHashedPasswordHere', 'Мария', 'Сидорова', 'Петровна', '+79011234570', 'patient', TRUE),
('patient3@mail.ru', '$2b$10$YourHashedPasswordHere', 'Сергей', 'Васильев', 'Александрович', '+79011234571', 'patient', TRUE),
('patient4@mail.ru', '$2b$10$YourHashedPasswordHere', 'Екатерина', 'Морозова', 'Дмитриевна', '+79011234572', 'patient', TRUE),
('patient5@mail.ru', '$2b$10$YourHashedPasswordHere', 'Андрей', 'Соколов', 'Петрович', '+79011234573', 'patient', TRUE);

-- Связывание пациентов с их медицинскими картами
INSERT INTO patients (user_id, medical_record_number, blood_type, allergies, chronic_diseases) VALUES
((SELECT id FROM users WHERE email = 'patient1@mail.ru'), 'MRN001', 'A+', 'Пенициллин', 'Гипертония'),
((SELECT id FROM users WHERE email = 'patient2@mail.ru'), 'MRN002', 'B-', 'Нет', 'Астма'),
((SELECT id FROM users WHERE email = 'patient3@mail.ru'), 'MRN003', 'O+', 'Аспирин', 'Диабет'),
((SELECT id FROM users WHERE email = 'patient4@mail.ru'), 'MRN004', 'AB+', 'Сульфаниламиды', 'Нет'),
((SELECT id FROM users WHERE email = 'patient5@mail.ru'), 'MRN005', 'A-', 'Нет', 'Артрит');

-- Добавление тестовых временных слотов
INSERT INTO time_slots (doctor_id, date, start_time, end_time, is_available) VALUES
((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@ivastrameds.ru'),
 DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)), '10:00:00', '10:30:00', FALSE),
((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@ivastrameds.ru'),
 DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY)), '11:00:00', '11:45:00', FALSE),
((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor3@ivastrameds.ru'),
 DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -1 DAY)), '14:00:00', '14:40:00', FALSE),
((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor4@ivastrameds.ru'),
 DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY)), '15:00:00', '15:30:00', FALSE),
((SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor5@ivastrameds.ru'),
 DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 DAY)), '16:00:00', '17:00:00', FALSE);

-- Добавление тестовых записей на прием
INSERT INTO appointments (patient_id, doctor_id, time_slot_id, appointment_type, status, reason_for_visit, created_by) VALUES
((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient1@mail.ru'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@ivastrameds.ru'),
 (SELECT ts.id FROM time_slots ts 
  JOIN doctors d ON ts.doctor_id = d.id 
  JOIN users u ON d.user_id = u.id 
  WHERE u.email = 'doctor1@ivastrameds.ru' AND DATE(ts.date) = DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY))),
 'first_visit', 'scheduled', 'Головная боль',
 (SELECT id FROM users WHERE email = 'registrar1@ivastrameds.ru')),

((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient2@mail.ru'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@ivastrameds.ru'),
 (SELECT ts.id FROM time_slots ts 
  JOIN doctors d ON ts.doctor_id = d.id 
  JOIN users u ON d.user_id = u.id 
  WHERE u.email = 'doctor2@ivastrameds.ru' AND DATE(ts.date) = DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY))),
 'first_visit', 'scheduled', 'Боль в груди',
 (SELECT id FROM users WHERE email = 'registrar1@ivastrameds.ru')),

((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient3@mail.ru'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor3@ivastrameds.ru'),
 (SELECT ts.id FROM time_slots ts 
  JOIN doctors d ON ts.doctor_id = d.id 
  JOIN users u ON d.user_id = u.id 
  WHERE u.email = 'doctor3@ivastrameds.ru' AND DATE(ts.date) = DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -1 DAY))),
 'follow_up', 'completed', 'Контрольный осмотр',
 (SELECT id FROM users WHERE email = 'registrar2@ivastrameds.ru')),

((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient4@mail.ru'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor4@ivastrameds.ru'),
 (SELECT ts.id FROM time_slots ts 
  JOIN doctors d ON ts.doctor_id = d.id 
  JOIN users u ON d.user_id = u.id 
  WHERE u.email = 'doctor4@ivastrameds.ru' AND DATE(ts.date) = DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY))),
 'first_visit', 'scheduled', 'Проблемы со зрением',
 (SELECT id FROM users WHERE email = 'registrar2@ivastrameds.ru')),

((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient5@mail.ru'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor5@ivastrameds.ru'),
 (SELECT ts.id FROM time_slots ts 
  JOIN doctors d ON ts.doctor_id = d.id 
  JOIN users u ON d.user_id = u.id 
  WHERE u.email = 'doctor5@ivastrameds.ru' AND DATE(ts.date) = DATE(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 DAY))),
 'first_visit', 'scheduled', 'Консультация по операции',
 (SELECT id FROM users WHERE email = 'registrar1@ivastrameds.ru'));

-- Добавление тестовых чатов
INSERT INTO chats (patient_id, doctor_id, created_at) VALUES
((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient1@mail.ru'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@ivastrameds.ru'),
 CURRENT_TIMESTAMP),
((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'patient2@mail.ru'),
 (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@ivastrameds.ru'),
 CURRENT_TIMESTAMP);

-- Добавление тестовых сообщений
INSERT INTO messages (chat_id, sender_id, message, message_type) VALUES
((SELECT c.id FROM chats c 
  JOIN patients p ON c.patient_id = p.id 
  JOIN users u ON p.user_id = u.id 
  WHERE u.email = 'patient1@mail.ru'),
 (SELECT id FROM users WHERE email = 'patient1@mail.ru'),
 'Здравствуйте, доктор! У меня есть вопрос по лечению.',
 'text'),
 
((SELECT c.id FROM chats c 
  JOIN patients p ON c.patient_id = p.id 
  JOIN users u ON p.user_id = u.id 
  WHERE u.email = 'patient1@mail.ru'),
 (SELECT u.id FROM users u 
  JOIN doctors d ON u.id = d.user_id 
  WHERE u.email = 'doctor1@ivastrameds.ru'),
 'Здравствуйте! Да, конечно, слушаю вас.',
 'text'),

((SELECT c.id FROM chats c 
  JOIN patients p ON c.patient_id = p.id 
  JOIN users u ON p.user_id = u.id 
  WHERE u.email = 'patient2@mail.ru'),
 (SELECT id FROM users WHERE email = 'patient2@mail.ru'),
 'Добрый день! Можно уточнить время приема?',
 'text'),
 
((SELECT c.id FROM chats c 
  JOIN patients p ON c.patient_id = p.id 
  JOIN users u ON p.user_id = u.id 
  WHERE u.email = 'patient2@mail.ru'),
 (SELECT u.id FROM users u 
  JOIN doctors d ON u.id = d.user_id 
  WHERE u.email = 'doctor2@ivastrameds.ru'),
 'Добрый день! Да, ваш прием завтра в 15:00.',
 'text');

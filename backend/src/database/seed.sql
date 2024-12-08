-- Добавление тестовых специализаций
INSERT INTO specializations (name, description, default_appointment_duration) VALUES
('Терапевт', 'Врач общей практики', 30),
('Кардиолог', 'Специалист по сердечно-сосудистой системе', 45),
('Невролог', 'Специалист по нервной системе', 40);

-- Добавление тестового администратора
INSERT INTO users (email, password_hash, first_name, last_name, role, verified) VALUES
('admin@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Администратор', 'Системы', 'admin', TRUE);

-- Добавление тестового регистратора
INSERT INTO users (email, password_hash, first_name, last_name, role, verified) VALUES
('registrar@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Регистратор', 'Клиники', 'registrar', TRUE);

-- Добавление тестовых врачей
INSERT INTO users (email, password_hash, first_name, last_name, middle_name, phone, role, verified) VALUES
('doctor1@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Иван', 'Петров', 'Сергеевич', '+79001234567', 'doctor', TRUE),
('doctor2@ivastrameds.ru', '$2b$10$YourHashedPasswordHere', 'Елена', 'Иванова', 'Александровна', '+79001234568', 'doctor', TRUE);

-- Связывание врачей со специализациями
INSERT INTO doctors (user_id, specialization_id, license_number, experience_years, office_number, consultation_fee) VALUES
((SELECT id FROM users WHERE email = 'doctor1@ivastrameds.ru'), 1, 'LIC123456', 10, '101', 1500.00),
((SELECT id FROM users WHERE email = 'doctor2@ivastrameds.ru'), 2, 'LIC123457', 15, '102', 2000.00);

-- Добавление тестовых пациентов
INSERT INTO users (email, password_hash, first_name, last_name, middle_name, phone, role, verified) VALUES
('patient1@mail.ru', '$2b$10$YourHashedPasswordHere', 'Алексей', 'Смирнов', 'Иванович', '+79001234569', 'patient', TRUE),
('patient2@mail.ru', '$2b$10$YourHashedPasswordHere', 'Мария', 'Сидорова', 'Петровна', '+79001234570', 'patient', TRUE);

-- Связывание пациентов с их медицинскими картами
INSERT INTO patients (user_id, medical_record_number, blood_type) VALUES
((SELECT id FROM users WHERE email = 'patient1@mail.ru'), 'MRN001', 'A+'),
((SELECT id FROM users WHERE email = 'patient2@mail.ru'), 'MRN002', 'B+');

-- Добавление расписания для врачей (на примере одного врача)
INSERT INTO doctor_schedule_templates (doctor_id, day_of_week, start_time, end_time, break_start, break_end, appointment_duration) VALUES
((SELECT id FROM doctors WHERE license_number = 'LIC123456'), 1, '09:00:00', '18:00:00', '13:00:00', '14:00:00', 30),
((SELECT id FROM doctors WHERE license_number = 'LIC123456'), 2, '09:00:00', '18:00:00', '13:00:00', '14:00:00', 30),
((SELECT id FROM doctors WHERE license_number = 'LIC123456'), 3, '09:00:00', '18:00:00', '13:00:00', '14:00:00', 30),
((SELECT id FROM doctors WHERE license_number = 'LIC123456'), 4, '09:00:00', '18:00:00', '13:00:00', '14:00:00', 30),
((SELECT id FROM doctors WHERE license_number = 'LIC123456'), 5, '09:00:00', '17:00:00', '13:00:00', '14:00:00', 30);

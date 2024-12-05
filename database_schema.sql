-- Отключаем проверку внешних ключей для удаления таблиц
SET FOREIGN_KEY_CHECKS=0;

-- Удаление существующих таблиц
DROP TABLE IF EXISTS AuditLog;
DROP TABLE IF EXISTS Documents;
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Chats;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS TimeSlots;
DROP TABLE IF EXISTS DoctorScheduleExceptions;
DROP TABLE IF EXISTS DoctorScheduleTemplates;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Specializations;
DROP TABLE IF EXISTS ResearchResults;
DROP TABLE IF EXISTS MedicalHistory;
DROP TABLE IF EXISTS EMR;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS UserSessions;
DROP TABLE IF EXISTS Users;

-- Включаем проверку внешних ключей
SET FOREIGN_KEY_CHECKS=1;

-- Создание основных таблиц
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    phone VARCHAR(20),
    passport VARCHAR(20),
    oms VARCHAR(20),
    address TEXT,
    birth_date DATE,
    gender VARCHAR(10),
    role ENUM('patient', 'doctor', 'registrar', 'admin') NOT NULL,
    avatar_url VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires DATETIME,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE UserSessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    medical_record_number VARCHAR(50) UNIQUE,
    blood_type VARCHAR(10),
    allergies TEXT,
    chronic_diseases TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    insurance_company VARCHAR(100),
    insurance_policy_number VARCHAR(50),
    insurance_expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE EMR (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    current_health_status TEXT,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    blood_pressure VARCHAR(20),
    last_survey_date DATE,
    last_checkup_date DATE,
    vaccination_history TEXT,
    family_medical_history TEXT,
    lifestyle_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(id)
);

CREATE TABLE Specializations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_appointment_duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    specialization_id INT NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    education TEXT,
    experience_years INT,
    achievements TEXT,
    certificates TEXT,
    rating DECIMAL(3,2),
    consultation_fee DECIMAL(10,2),
    about_doctor TEXT,
    office_number VARCHAR(20),
    is_accepting_patients BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (specialization_id) REFERENCES Specializations(id)
);

CREATE TABLE MedicalHistory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    emr_id INT NOT NULL,
    doctor_id INT NOT NULL,
    visit_date DATE NOT NULL,
    diagnosis TEXT NOT NULL,
    symptoms TEXT,
    treatment_plan TEXT,
    prescribed_medications TEXT,
    lab_orders TEXT,
    follow_up_notes TEXT,
    attachments TEXT,
    is_chronic BOOLEAN DEFAULT FALSE,
    severity ENUM('low', 'medium', 'high') NOT NULL,
    status ENUM('active', 'resolved', 'ongoing') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (emr_id) REFERENCES EMR(id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
);

CREATE TABLE ResearchResults (
    id INT PRIMARY KEY AUTO_INCREMENT,
    emr_id INT NOT NULL,
    doctor_id INT NOT NULL,
    research_type VARCHAR(100) NOT NULL,
    result_summary TEXT NOT NULL,
    detailed_results TEXT,
    normal_range TEXT,
    is_abnormal BOOLEAN,
    lab_name VARCHAR(100),
    lab_technician VARCHAR(100),
    collection_date DATE,
    result_date DATE,
    file_urls TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emr_id) REFERENCES EMR(id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
);

CREATE TABLE DoctorScheduleTemplates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    day_of_week INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    appointment_duration INT NOT NULL,
    max_patients_per_day INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
);

CREATE TABLE DoctorScheduleExceptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    exception_date DATE NOT NULL,
    is_working_day BOOLEAN DEFAULT TRUE,
    start_time TIME,
    end_time TIME,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
);

CREATE TABLE TimeSlots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    slot_type ENUM('regular', 'emergency', 'follow_up') DEFAULT 'regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
);

CREATE TABLE Appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    time_slot_id INT NOT NULL,
    appointment_type ENUM('first_visit', 'follow_up', 'consultation', 'emergency') NOT NULL,
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'canceled', 'no_show') NOT NULL,
    reason_for_visit TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    treatment_notes TEXT,
    prescription TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_notes TEXT,
    cancellation_reason TEXT,
    canceled_by INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(id),
    FOREIGN KEY (time_slot_id) REFERENCES TimeSlots(id),
    FOREIGN KEY (created_by) REFERENCES Users(id),
    FOREIGN KEY (canceled_by) REFERENCES Users(id)
);

CREATE TABLE Chats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    last_message_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
);

CREATE TABLE Messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('text', 'image', 'file', 'system') NOT NULL,
    file_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES Chats(id),
    FOREIGN KEY (sender_id) REFERENCES Users(id)
);

CREATE TABLE Files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    emr_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_id INT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INT,
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emr_id) REFERENCES EMR(id),
    FOREIGN KEY (file_id) REFERENCES Files(id),
    FOREIGN KEY (verified_by) REFERENCES Users(id)
);

CREATE TABLE Notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('appointment', 'message', 'system', 'reminder', 'lab_result') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE AuditLog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Вставка начальных данных

-- Администратор
INSERT INTO Users (email, password_hash, first_name, last_name, role, verified)
VALUES ('admin@ivastrameds.com', '$2a$10$SECURE_HASH', 'Администратор', 'Системы', 'admin', true);

-- Специализации врачей
INSERT INTO Specializations (name, description, default_appointment_duration)
VALUES 
('Терапевт', 'Врач общей практики', 30),
('Кардиолог', 'Специалист по сердечно-сосудистой системе', 45),
('Невролог', 'Специалист по нервной системе', 40),
('Офтальмолог', 'Специалист по заболеваниям глаз', 30),
('Хирург', 'Специалист по хирургическим вмешательствам', 60);

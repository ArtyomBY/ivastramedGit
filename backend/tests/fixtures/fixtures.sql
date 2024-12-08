-- SQL script to initialize test data for documents

-- Drop existing tables if they exist
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table
CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create patients table
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create documents table
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    patient_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Create appointments table
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT,
    patient_id INT,
    appointment_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Insert test data
-- Test users
INSERT INTO users (email, password, role) VALUES
('admin@test.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'admin'),
('doctor1@test.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'doctor'),
('doctor2@test.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'doctor'),
('patient1@test.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'patient'),
('patient2@test.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'patient');

-- Test doctors
INSERT INTO doctors (user_id, first_name, last_name, specialization) VALUES
(2, 'John', 'Smith', 'Cardiologist'),
(3, 'Jane', 'Doe', 'Neurologist');

-- Test patients
INSERT INTO patients (user_id, first_name, last_name, date_of_birth) VALUES
(4, 'Alice', 'Johnson', '1990-01-01'),
(5, 'Bob', 'Wilson', '1985-05-15');

-- Test documents
INSERT INTO documents (title, content, patient_id) VALUES
('Medical History', 'Patient medical history content', 1),
('Test Results', 'Blood test results', 1),
('Prescription', 'Medication prescription details', 2);

-- Test appointments
INSERT INTO appointments (doctor_id, patient_id, appointment_date, status, notes) VALUES
(1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 'scheduled', 'Regular checkup'),
(2, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), 'scheduled', 'Follow-up appointment'),
(1, 2, DATE_ADD(NOW(), INTERVAL -1 DAY), 'completed', 'Initial consultation');

-- Test Document 1
INSERT INTO documents (title, content, patient_id, created_at) VALUES
('Test Document 1', 'Content for document 1', 1, NOW());

-- Test Document 2
INSERT INTO documents (title, content, patient_id, created_at) VALUES
('Test Document 2', 'Content for document 2', 2, NOW());

-- Test Document 3
INSERT INTO documents (title, content, patient_id, created_at) VALUES
('Test Document 3', 'Content for document 3', 1, NOW());

import { pool } from '../config/database';
import mysql2, { RowDataPacket } from 'mysql2/promise';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export class PatientModel {
  static async getAllPatients(): Promise<Patient[]> {
    const [rows] = await pool.execute('SELECT * FROM patients');
    return rows as Patient[];
  }

  static async getPatientById(id: number): Promise<Patient | null> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM patients WHERE id = ?', [id]);
    const patient = rows[0];
    return patient ? (patient as Patient) : null;
  }

  static async createPatient(patient: Omit<Patient, 'id'>): Promise<number> {
    const [result] = await pool.execute<mysql2.ResultSetHeader>(
      'INSERT INTO patients (first_name, last_name, email, date_of_birth) VALUES (?, ?, ?, ?)',
      [patient.firstName, patient.lastName, patient.email, patient.dateOfBirth]
    );
    return result.insertId;
  }

  static async updatePatient(id: number, patient: Partial<Omit<Patient, 'id'>>): Promise<void> {
    await pool.execute(
      'UPDATE patients SET first_name = ?, last_name = ?, email = ?, date_of_birth = ? WHERE id = ?',
      [patient.firstName, patient.lastName, patient.email, patient.dateOfBirth, id]
    );
  }

  static async deletePatient(id: number): Promise<void> {
    await pool.execute('DELETE FROM patients WHERE id = ?', [id]);
  }
}

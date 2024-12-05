import { pool } from '../config/database';
import mysql2, { RowDataPacket } from 'mysql2/promise';

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
}

export class DoctorModel {
  static async getAllDoctors(): Promise<Doctor[]> {
    const [rows] = await pool.execute('SELECT * FROM doctors');
    return rows as Doctor[];
  }

  static async getDoctorById(id: number): Promise<Doctor | null> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM doctors WHERE id = ?', [id]);
    const doctor = rows[0];
    return doctor ? (doctor as Doctor) : null;
  }

  static async createDoctor(doctor: Omit<Doctor, 'id'>): Promise<number> {
    const [result] = await pool.execute<mysql2.ResultSetHeader>(
      'INSERT INTO doctors (first_name, last_name, email, specialty) VALUES (?, ?, ?, ?)',
      [doctor.firstName, doctor.lastName, doctor.email, doctor.specialty]
    );
    return result.insertId;
  }

  static async updateDoctor(id: number, doctor: Partial<Omit<Doctor, 'id'>>): Promise<void> {
    await pool.execute(
      'UPDATE doctors SET first_name = ?, last_name = ?, email = ?, specialty = ? WHERE id = ?',
      [doctor.firstName, doctor.lastName, doctor.email, doctor.specialty, id]
    );
  }

  static async deleteDoctor(id: number): Promise<void> {
    await pool.execute('DELETE FROM doctors WHERE id = ?', [id]);
  }
}

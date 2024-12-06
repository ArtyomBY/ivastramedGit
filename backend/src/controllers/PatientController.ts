import { Request, Response } from 'express';
import { PatientModel } from '../models/PatientModel';

export class PatientController {
    static async getAllPatients(req: Request, res: Response): Promise<void> {
        try {
            const patients = await PatientModel.getAllPatients();
            res.json(patients);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении списка пациентов', error });
        }
    }

    static async getPatientById(req: Request, res: Response): Promise<void> {
        try {
            const patient = await PatientModel.getPatientById(Number(req.params.id));
            if (!patient) {
                res.status(404).json({ message: 'Пациент не найден' });
                return;
            }
            res.json(patient);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении пациента', error });
        }
    }

    static async createPatient(req: Request, res: Response): Promise<void> {
        try {
            const newPatientId = await PatientModel.createPatient(req.body);
            res.status(201).json({ id: newPatientId });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при создании пациента', error });
        }
    }

    static async updatePatient(req: Request, res: Response): Promise<void> {
        try {
            await PatientModel.updatePatient(Number(req.params.id), req.body);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении пациента', error });
        }
    }

    static async deletePatient(req: Request, res: Response): Promise<void> {
        try {
            await PatientModel.deletePatient(Number(req.params.id));
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении пациента', error });
        }
    }
}

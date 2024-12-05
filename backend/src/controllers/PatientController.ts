import { Request, Response } from 'express';
import { PatientModel } from '../models/PatientModel';

export class PatientController {
  static async getAllPatients(req: Request, res: Response): Promise<void> {
    try {
      const patients = await PatientModel.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve patients.' });
    }
  }

  static async getPatientById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const patient = await PatientModel.getPatientById(Number(id));
      if (!patient) {
        res.status(404).json({ message: 'Patient not found.' });
        return;
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve patient.' });
    }
  }

  static async createPatient(req: Request, res: Response): Promise<void> {
    try {
      await PatientModel.createPatient(req.body);
      res.status(201).json({ message: 'Patient created successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create patient.' });
    }
  }

  static async updatePatient(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await PatientModel.updatePatient(Number(id), req.body);
      res.json({ message: 'Patient updated successfully.' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Patient not found') {
        res.status(404).json({ message: 'Patient not found.' });
      } else {
        res.status(500).json({ message: 'Failed to update patient.' });
      }
    }
  }

  static async deletePatient(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await PatientModel.deletePatient(Number(id));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Patient not found') {
        res.status(404).json({ message: 'Patient not found.' });
      } else {
        res.status(500).json({ message: 'Failed to delete patient.' });
      }
    }
  }
}

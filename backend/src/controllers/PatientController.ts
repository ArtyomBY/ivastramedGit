import { Request, Response } from 'express';
import { PatientModel } from '../models/PatientModel';

export class PatientController {
  static async getAllPatients(req: Request, res: Response) {
    try {
      const patients = await PatientModel.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve patients.', error });
    }
  }

  static async getPatientById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const patient = await PatientModel.getPatientById(Number(id));
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve patient.', error });
    }
  }

  static async createPatient(req: Request, res: Response) {
    const { firstName, lastName, email, dateOfBirth } = req.body;
    try {
      const patientId = await PatientModel.createPatient({ firstName, lastName, email, dateOfBirth });
      res.status(201).json({ id: patientId });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create patient.', error });
    }
  }

  static async updatePatient(req: Request, res: Response) {
    const { id } = req.params;
    const { firstName, lastName, email, dateOfBirth } = req.body;
    try {
      await PatientModel.updatePatient(Number(id), { firstName, lastName, email, dateOfBirth });
      res.json({ message: 'Patient updated successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update patient.', error });
    }
  }

  static async deletePatient(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await PatientModel.deletePatient(Number(id));
      res.json({ message: 'Patient deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete patient.', error });
    }
  }
}

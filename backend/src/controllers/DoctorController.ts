import { Request, Response } from 'express';
import { DoctorModel } from '../models/DoctorModel';

export class DoctorController {
  static async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      const doctors = await DoctorModel.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve doctors.' });
    }
  }

  static async getDoctorById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const doctor = await DoctorModel.getDoctorById(Number(id));
      if (!doctor) {
        res.status(404).json({ message: 'Doctor not found.' });
        return;
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve doctor.' });
    }
  }

  static async createDoctor(req: Request, res: Response): Promise<void> {
    try {
      await DoctorModel.createDoctor(req.body);
      res.status(201).json({ message: 'Doctor created successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create doctor.' });
    }
  }

  static async updateDoctor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await DoctorModel.updateDoctor(Number(id), req.body);
      res.json({ message: 'Doctor updated successfully.' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Doctor not found') {
        res.status(404).json({ message: 'Doctor not found.' });
      } else {
        res.status(500).json({ message: 'Failed to update doctor.' });
      }
    }
  }

  static async deleteDoctor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await DoctorModel.deleteDoctor(Number(id));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Doctor not found') {
        res.status(404).json({ message: 'Doctor not found.' });
      } else {
        res.status(500).json({ message: 'Failed to delete doctor.' });
      }
    }
  }
}

import { Request, Response } from 'express';
import { DoctorModel } from '../models/DoctorModel';

export class DoctorController {
  static async getAllDoctors(req: Request, res: Response) {
    try {
      const doctors = await DoctorModel.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve doctors.', error });
    }
  }

  static async getDoctorById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const doctor = await DoctorModel.getDoctorById(Number(id));
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found.' });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve doctor.', error });
    }
  }

  static async createDoctor(req: Request, res: Response) {
    const { firstName, lastName, email, specialty } = req.body;
    try {
      const doctorId = await DoctorModel.createDoctor({ firstName, lastName, email, specialty });
      res.status(201).json({ id: doctorId });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create doctor.', error });
    }
  }

  static async updateDoctor(req: Request, res: Response) {
    const { id } = req.params;
    const { firstName, lastName, email, specialty } = req.body;
    try {
      await DoctorModel.updateDoctor(Number(id), { firstName, lastName, email, specialty });
      res.json({ message: 'Doctor updated successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update doctor.', error });
    }
  }

  static async deleteDoctor(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await DoctorModel.deleteDoctor(Number(id));
      res.json({ message: 'Doctor deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete doctor.', error });
    }
  }
}

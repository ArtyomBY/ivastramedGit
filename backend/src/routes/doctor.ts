import express from 'express';
import { DoctorController } from '../controllers/DoctorController';
import { authenticate } from '../middleware/auth';
import { validateDoctorData } from '../middleware/validation';

const router = express.Router();

// Маршрут для получения всех врачей
router.get('/', authenticate, DoctorController.getAllDoctors);

// Маршрут для получения врача по ID
router.get('/:id', authenticate, DoctorController.getDoctorById);

// Маршрут для создания нового врача
router.post('/', authenticate, validateDoctorData, DoctorController.createDoctor);

// Маршрут для обновления врача
router.put('/:id', authenticate, validateDoctorData, DoctorController.updateDoctor);

// Маршрут для удаления врача
router.delete('/:id', authenticate, DoctorController.deleteDoctor);

export default router;

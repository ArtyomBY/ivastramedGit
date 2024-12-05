import express from 'express';
import { PatientController } from '../controllers/PatientController';
import { authenticate } from '../middleware/auth';
import { validatePatientData } from '../middleware/validation';
import { checkRole } from '../middleware/roleCheck';

const router = express.Router();

// Маршрут для получения всех пациентов
router.get('/', authenticate, PatientController.getAllPatients);

// Маршрут для получения пациента по ID
router.get('/:id', authenticate, PatientController.getPatientById);

// Маршрут для создания нового пациента
router.post('/', authenticate, checkRole('admin'), validatePatientData, PatientController.createPatient);

// Маршрут для обновления пациента
router.put('/:id', authenticate, checkRole('admin'), validatePatientData, PatientController.updatePatient);

// Маршрут для удаления пациента
router.delete('/:id', authenticate, checkRole('admin'), PatientController.deletePatient);

export default router;

import express from 'express';
import { PatientController } from '../controllers/PatientController';
import { authenticate } from '../middleware/auth';
import { validatePatientData } from '../middleware/validation';
import { checkRole } from '../middleware/roleCheck';

const router = express.Router();

// Маршрут для получения всех пациентов
router.get('/', authenticate, async (req, res, next) => {
    try {
        await PatientController.getAllPatients(req, res);
    } catch (error) {
        next(error);
    }
});

// Маршрут для получения пациента по ID
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        await PatientController.getPatientById(req, res);
    } catch (error) {
        next(error);
    }
});

// Маршрут для создания нового пациента
router.post('/', authenticate, checkRole('admin'), validatePatientData, async (req, res, next) => {
    try {
        await PatientController.createPatient(req, res);
    } catch (error) {
        next(error);
    }
});

// Маршрут для обновления пациента
router.put('/:id', authenticate, checkRole('admin'), validatePatientData, async (req, res, next) => {
    try {
        await PatientController.updatePatient(req, res);
    } catch (error) {
        next(error);
    }
});

// Маршрут для удаления пациента
router.delete('/:id', authenticate, checkRole('admin'), async (req, res, next) => {
    try {
        await PatientController.deletePatient(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;

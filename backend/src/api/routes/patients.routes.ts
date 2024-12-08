import { Router } from 'express';
import * as patientsController from '../controllers/patients.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authMiddleware, patientsController.getPatientProfile);
router.put('/profile', authMiddleware, patientsController.updatePatientProfile);
router.get('/medical-history', authMiddleware, patientsController.getPatientMedicalHistory);

export default router;

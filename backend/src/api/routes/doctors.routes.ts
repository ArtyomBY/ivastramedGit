import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as doctorsController from '../controllers/doctors.controller';

const router = Router();

router.get('/', doctorsController.getDoctors);
router.get('/:doctorId', doctorsController.getDoctorDetails);
router.get('/specializations', doctorsController.getSpecializations);

export default router;

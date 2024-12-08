import { Router } from 'express';
import * as appointmentsController from '../controllers/appointments.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, appointmentsController.createAppointment);
router.get('/my', authMiddleware, appointmentsController.getPatientAppointments);
router.post('/:id/cancel', authMiddleware, appointmentsController.cancelAppointment);

export default router;

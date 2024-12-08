import { Router } from 'express';
import * as registrarController from '../controllers/registrar.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Middleware для проверки роли регистратора
const registrarMiddleware = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'registrar') {
        return res.status(403).json({ message: 'Доступ запрещен' });
    }
    next();
};

router.use(authMiddleware);
router.use(registrarMiddleware);

router.post('/appointments', registrarController.createAppointmentForPatient);
router.post('/patients', registrarController.registerNewPatient);
router.put('/doctors/:doctorId/schedule', registrarController.manageDoctorSchedule);
router.get('/appointments/search', registrarController.searchAppointments);

export default router;

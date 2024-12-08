import { Router } from 'express';
import authRoutes from './routes/auth.routes';
import doctorsRoutes from './routes/doctors.routes';
import patientsRoutes from './routes/patients.routes';
import appointmentsRoutes from './routes/appointments.routes';
import chatsRoutes from './routes/chats.routes';
import notificationsRoutes from './routes/notifications.routes';
import registrarRoutes from './routes/registrar.routes';
import adminRoutes from './routes/admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/doctors', doctorsRoutes);
router.use('/patients', patientsRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/chats', chatsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/registrar', registrarRoutes);
router.use('/admin', adminRoutes);

export default router;

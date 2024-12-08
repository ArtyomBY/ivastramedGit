import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Middleware для проверки роли администратора
const adminMiddleware = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен' });
    }
    next();
};

router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/doctors', adminController.createDoctor);
router.post('/registrars', adminController.createRegistrar);
router.post('/specializations', adminController.manageSpecializations);
router.put('/specializations/:id', adminController.manageSpecializations);
router.delete('/specializations/:id', adminController.manageSpecializations);
router.post('/users/manage', adminController.manageUsers);
router.get('/statistics', adminController.getStatistics);

export default router;

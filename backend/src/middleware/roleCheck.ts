import { Request, Response, NextFunction } from 'express';

interface RequestWithUser extends Request {
    user?: {
        id: string;
        role: string;
        email: string;
    };
}

export const checkRole = (role: string) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Пользователь не авторизован' });
                return;
            }

            const userRole = req.user.role;
            
            if (!userRole) {
                res.status(403).json({ message: 'Роль пользователя не определена' });
                return;
            }

            if (userRole !== role) {
                res.status(403).json({ message: 'Недостаточно прав для выполнения операции' });
                return;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

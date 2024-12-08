import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import { AuthRequest } from '../../types';

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Токен не предоставлен' });
            return;
        }

        const decoded = jwt.verify(token, config.jwtSecret) as {
            id: string;
            role: string;
            email: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Ошибка аутентификации:', error);
        res.status(401).json({ message: 'Недействительный токен' });
    }
};

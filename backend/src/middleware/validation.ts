import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const patientSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{10,14}$/),
    email: z.string().email().optional(),
    address: z.string().min(5).max(200),
});

export const validatePatientData = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await patientSchema.parseAsync(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: 'Ошибка валидации данных',
                errors: error.errors
            });
            return;
        }
        next(error);
    }
};

export const validateDoctorData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { firstName, lastName, email, specialty } = req.body;
  if (!firstName || !lastName || !email || !specialty) {
    res.status(400).json({ message: 'Missing required doctor data.' });
    return;
  }
  next();
};

export const validateDocumentData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, content, patientId } = req.body;
  if (!title || !content || !patientId) {
    res.status(400).json({ message: 'Missing required document data.' });
    return;
  }
  next();
};

export const validateMessageData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { content, senderId, receiverId } = req.body;
  if (!content || !senderId || !receiverId) {
    res.status(400).json({ message: 'Missing required message data.' });
    return;
  }
  next();
};

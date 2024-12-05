import { Request, Response, NextFunction } from 'express';

export const validatePatientData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { firstName, lastName, email, dateOfBirth } = req.body;
  if (!firstName || !lastName || !email || !dateOfBirth) {
    res.status(400).json({ message: 'Missing required patient data.' });
    return;
  }
  next();
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

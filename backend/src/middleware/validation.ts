import { Request, Response, NextFunction } from 'express';

export const validatePatientData = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, dateOfBirth } = req.body;
  if (!firstName || !lastName || !email || !dateOfBirth) {
    return res.status(400).json({ message: 'Missing required patient data.' });
  }
  // Additional validation logic can be added here
  next();
};

export const validateDoctorData = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, specialty } = req.body;
  if (!firstName || !lastName || !email || !specialty) {
    return res.status(400).json({ message: 'Missing required doctor data.' });
  }
  // Additional validation logic can be added here
  next();
};

export const validateDocumentData = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, patientId } = req.body;
  if (!title || !content || !patientId) {
    return res.status(400).json({ message: 'Missing required document data.' });
  }
  // Additional validation logic can be added here
  next();
};

export const validateMessageData = (req: Request, res: Response, next: NextFunction) => {
  const { senderId, receiverId, content } = req.body;
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ message: 'Missing required message data.' });
  }
  // Additional validation logic can be added here
  next();
};

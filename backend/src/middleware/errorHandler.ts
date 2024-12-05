import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  logger.error('Error: %o', err);
  res.status(500).json({ message: 'An unexpected error occurred.', error: err.message });
};

import express from 'express';
import { DocumentController } from '../controllers/DocumentController';
import { authenticate } from '../middleware/auth';
import { validateDocumentData } from '../middleware/validation';

const router = express.Router();

// Маршрут для получения всех документов
router.get('/', authenticate, DocumentController.getAllDocuments);

// Маршрут для получения документа по ID
router.get('/:id', authenticate, DocumentController.getDocumentById);

// Маршрут для создания нового документа
router.post('/', authenticate, validateDocumentData, DocumentController.createDocument);

// Маршрут для обновления документа
router.put('/:id', authenticate, validateDocumentData, DocumentController.updateDocument);

// Маршрут для удаления документа
router.delete('/:id', authenticate, DocumentController.deleteDocument);

export default router;

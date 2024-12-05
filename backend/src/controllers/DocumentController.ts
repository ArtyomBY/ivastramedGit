import { Request, Response } from 'express';
import { DocumentModel } from '../models/DocumentModel';

export class DocumentController {
  static async getAllDocuments(req: Request, res: Response): Promise<void> {
    try {
      const documents = await DocumentModel.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve documents.' });
    }
  }

  static async getDocumentById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const document = await DocumentModel.getDocumentById(Number(id));
      if (!document) {
        res.status(404).json({ message: 'Document not found.' });
        return;
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve document.' });
    }
  }

  static async createDocument(req: Request, res: Response): Promise<void> {
    try {
      await DocumentModel.createDocument(req.body);
      res.status(201).json({ message: 'Document created successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create document.' });
    }
  }

  static async updateDocument(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await DocumentModel.updateDocument(Number(id), req.body);
      res.json({ message: 'Document updated successfully.' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Document not found') {
        res.status(404).json({ message: 'Document not found.' });
      } else {
        res.status(500).json({ message: 'Failed to update document.' });
      }
    }
  }

  static async deleteDocument(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await DocumentModel.deleteDocument(Number(id));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Document not found') {
        res.status(404).json({ message: 'Document not found.' });
      } else {
        res.status(500).json({ message: 'Failed to delete document.' });
      }
    }
  }
}

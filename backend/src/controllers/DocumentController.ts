import { Request, Response } from 'express';
import { DocumentModel } from '../models/DocumentModel';

export class DocumentController {
  static async getAllDocuments(req: Request, res: Response) {
    try {
      const documents = await DocumentModel.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve documents.', error });
    }
  }

  static async getDocumentById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const document = await DocumentModel.getDocumentById(Number(id));
      if (!document) {
        return res.status(404).json({ message: 'Document not found.' });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve document.', error });
    }
  }

  static async createDocument(req: Request, res: Response) {
    const { title, content, patientId } = req.body;
    try {
      const documentId = await DocumentModel.createDocument({ title, content, patientId });
      res.status(201).json({ id: documentId });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create document.', error });
    }
  }

  static async updateDocument(req: Request, res: Response) {
    const { id } = req.params;
    const { title, content, patientId } = req.body;
    try {
      await DocumentModel.updateDocument(Number(id), { title, content, patientId });
      res.json({ message: 'Document updated successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update document.', error });
    }
  }

  static async deleteDocument(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await DocumentModel.deleteDocument(Number(id));
      res.json({ message: 'Document deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete document.', error });
    }
  }
}

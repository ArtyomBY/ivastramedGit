import { pool } from '../config/database';
import mysql2 from 'mysql2/promise';
import logger from '../utils/logger';

export interface Document {
  id: number;
  title: string;
  content: string;
  patientId: number;
  createdAt: Date;
}

export class DocumentModel {
  static async getAllDocuments(): Promise<Document[]> {
    try {
      logger.info('Fetching all documents from the database.');
      const [rows]: [mysql2.RowDataPacket[], mysql2.FieldPacket[]] = await pool.execute('SELECT * FROM documents');
      logger.info(`Fetched ${rows.length} documents.`);
      return rows as Document[];
    } catch (error) {
      logger.error('Error fetching documents:', error);
      throw error;
    }
  }

  static async getDocumentById(id: number): Promise<Document | null> {
    try {
      logger.info(`Fetching document with ID: ${id}.`);
      const [rows]: [mysql2.RowDataPacket[], mysql2.FieldPacket[]] = await pool.execute('SELECT * FROM documents WHERE id = ?', [id]);
      const document = rows[0];
      if (document) {
        logger.info(`Document found: ${document.id}.`);
      } else {
        logger.warn(`Document with ID: ${id} not found.`);
      }
      return document ? (document as Document) : null;
    } catch (error) {
      logger.error(`Error fetching document with ID: ${id}.`, error);
      throw error;
    }
  }

  static async createDocument(document: Omit<Document, 'id' | 'createdAt'>): Promise<number> {
    try {
      logger.info('Creating a new document.');
      const [result] = await pool.execute<mysql2.ResultSetHeader>(
        'INSERT INTO documents (title, content, patient_id) VALUES (?, ?, ?)',
        [document.title, document.content, document.patientId]
      );
      logger.info(`Document created with ID: ${result.insertId}.`);
      return result.insertId;
    } catch (error) {
      logger.error('Error creating document:', error);
      throw error;
    }
  }

  static async updateDocument(id: number, document: Partial<Omit<Document, 'id' | 'createdAt'>>): Promise<void> {
    try {
      logger.info(`Updating document with ID: ${id}.`);
      await pool.execute(
        'UPDATE documents SET title = ?, content = ?, patient_id = ? WHERE id = ?',
        [document.title, document.content, document.patientId, id]
      );
      logger.info(`Document with ID: ${id} updated successfully.`);
    } catch (error) {
      logger.error(`Error updating document with ID: ${id}.`, error);
      throw error;
    }
  }

  static async deleteDocument(id: number): Promise<void> {
    try {
      logger.info(`Deleting document with ID: ${id}.`);
      await pool.execute('DELETE FROM documents WHERE id = ?', [id]);
      logger.info(`Document with ID: ${id} deleted successfully.`);
    } catch (error) {
      logger.error(`Error deleting document with ID: ${id}.`, error);
      throw error;
    }
  }
}

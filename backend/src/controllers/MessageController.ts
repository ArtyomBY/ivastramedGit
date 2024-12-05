import { Request, Response } from 'express';
import { MessageModel } from '../models/MessageModel';

export class MessageController {
  static async getAllMessages(req: Request, res: Response) {
    try {
      const messages = await MessageModel.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve messages.', error });
    }
  }

  static async getMessageById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const message = await MessageModel.getMessageById(Number(id));
      if (!message) {
        return res.status(404).json({ message: 'Message not found.' });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve message.', error });
    }
  }

  static async createMessage(req: Request, res: Response) {
    const { senderId, receiverId, content } = req.body;
    try {
      const messageId = await MessageModel.createMessage({ senderId, receiverId, content });
      res.status(201).json({ id: messageId });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create message.', error });
    }
  }

  static async updateMessage(req: Request, res: Response) {
    const { id } = req.params;
    const { senderId, receiverId, content } = req.body;
    try {
      await MessageModel.updateMessage(Number(id), { senderId, receiverId, content });
      res.json({ message: 'Message updated successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update message.', error });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await MessageModel.deleteMessage(Number(id));
      res.json({ message: 'Message deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete message.', error });
    }
  }
}

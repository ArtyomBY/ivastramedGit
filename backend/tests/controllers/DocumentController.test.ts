import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';

const mockAdminToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'test_secret');

// Пример тестов для DocumentController

describe('DocumentController', () => {
  it('should get all documents', async () => {
    const response = await request(app)
      .get('/documents')
      .set('Authorization', `Bearer ${mockAdminToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a document by ID', async () => {
    const response = await request(app)
      .get('/documents/1')
      .set('Authorization', `Bearer ${mockAdminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  // Добавьте больше тестов для создания, обновления и удаления документов
});

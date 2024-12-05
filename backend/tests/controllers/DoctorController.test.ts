import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';
import { describe, it, expect } from '@jest/globals';

const mockAdminToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'test_secret');

// Пример тестов для DoctorController

describe('DoctorController', () => {
  it('should get all doctors', async () => {
    const response = await request(app)
      .get('/doctors')
      .set('Authorization', `Bearer ${mockAdminToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a doctor by ID', async () => {
    const response = await request(app)
      .get('/doctors/1')
      .set('Authorization', `Bearer ${mockAdminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  // Добавьте больше тестов для создания, обновления и удаления врачей
});

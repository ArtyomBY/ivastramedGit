import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';
import { describe, it, expect } from '@jest/globals';

const mockAdminToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'test_secret');

describe('PatientController', () => {
  it('should fetch all patients', async () => {
    const response = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${mockAdminToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 404 for non-existing patient', async () => {
    const response = await request(app)
      .get('/api/patients/999')
      .set('Authorization', `Bearer ${mockAdminToken}`);
    expect(response.status).toBe(404);
  });
});

describe('Role-based access control', () => {
  it('should allow admin to create a patient', async () => {
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${mockAdminToken}`)
      .send({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', dateOfBirth: '1990-01-01' });
    expect(response.status).toBe(201);
  });

  it('should deny non-admin to create a patient', async () => {
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', 'Bearer valid_user_token')
      .send({ firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', dateOfBirth: '1992-02-02' });
    expect(response.status).toBe(403);
  });

  // Similar tests for update and delete operations
});

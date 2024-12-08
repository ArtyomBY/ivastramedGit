import request from 'supertest';
import { app } from '../../src/app';
import jwt from 'jsonwebtoken';

describe('PatientController', () => {
  let patientToken: string;
  let doctorToken: string;
  let adminToken: string;

  beforeAll(() => {
    // Create test tokens
    patientToken = jwt.sign(
      { id: 4, email: 'patient1@test.com', role: 'patient' },
      process.env.JWT_SECRET || 'test_secret'
    );

    doctorToken = jwt.sign(
      { id: 2, email: 'doctor1@test.com', role: 'doctor' },
      process.env.JWT_SECRET || 'test_secret'
    );

    adminToken = jwt.sign(
      { id: 1, email: 'admin@test.com', role: 'admin' },
      process.env.JWT_SECRET || 'test_secret'
    );
  });

  describe('GET /api/patients', () => {
    it('should return all patients when authenticated as doctor', async () => {
      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 403 when authenticated as patient', async () => {
      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/patients/:id', () => {
    it('should return patient details when authenticated as the same patient', async () => {
      const response = await request(app)
        .get('/api/patients/1')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('last_name');
      expect(response.body).toHaveProperty('date_of_birth');
    });

    it('should return patient details when authenticated as doctor', async () => {
      const response = await request(app)
        .get('/api/patients/1')
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 404 for non-existent patient', async () => {
      const response = await request(app)
        .get('/api/patients/999')
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/patients', () => {
    it('should create a new patient when authenticated as admin', async () => {
      const newPatient = {
        email: 'newpatient@test.com',
        password: 'password123',
        first_name: 'New',
        last_name: 'Patient',
        date_of_birth: '1995-05-15'
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newPatient);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.first_name).toBe(newPatient.first_name);
      expect(response.body.last_name).toBe(newPatient.last_name);
      expect(response.body.date_of_birth).toBe(newPatient.date_of_birth);
    });

    it('should return 400 for invalid patient data', async () => {
      const invalidPatient = {
        email: 'invalid-email',
        password: '123',
        first_name: '',
        last_name: '',
        date_of_birth: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidPatient);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/patients/:id', () => {
    it('should update patient details when authenticated as the same patient', async () => {
      const updateData = {
        first_name: 'Updated',
        last_name: 'Name',
        date_of_birth: '1990-01-01'
      };

      const response = await request(app)
        .put('/api/patients/1')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe(updateData.first_name);
      expect(response.body.last_name).toBe(updateData.last_name);
      expect(response.body.date_of_birth).toBe(updateData.date_of_birth);
    });

    it('should return 403 when trying to update another patient', async () => {
      const updateData = {
        first_name: 'Unauthorized',
        last_name: 'Update',
        date_of_birth: '1990-01-01'
      };

      const response = await request(app)
        .put('/api/patients/2')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/patients/:id/documents', () => {
    it('should return patient documents when authenticated as the same patient', async () => {
      const response = await request(app)
        .get('/api/patients/1/documents')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return patient documents when authenticated as doctor', async () => {
      const response = await request(app)
        .get('/api/patients/1/documents')
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

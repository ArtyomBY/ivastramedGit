import request from 'supertest';
import { app } from '../../src/app';
import jwt from 'jsonwebtoken';

describe('DoctorController', () => {
  let doctorToken: string;
  let adminToken: string;

  beforeAll(() => {
    // Create test tokens
    doctorToken = jwt.sign(
      { id: 2, email: 'doctor1@test.com', role: 'doctor' },
      process.env.JWT_SECRET || 'test_secret'
    );

    adminToken = jwt.sign(
      { id: 1, email: 'admin@test.com', role: 'admin' },
      process.env.JWT_SECRET || 'test_secret'
    );
  });

  describe('GET /api/doctors', () => {
    it('should return all doctors when authenticated as admin', async () => {
      const response = await request(app)
        .get('/api/doctors')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 403 when authenticated as patient', async () => {
      const patientToken = jwt.sign(
        { id: 4, email: 'patient1@test.com', role: 'patient' },
        process.env.JWT_SECRET || 'test_secret'
      );

      const response = await request(app)
        .get('/api/doctors')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/doctors/:id', () => {
    it('should return doctor details when authenticated', async () => {
      const response = await request(app)
        .get('/api/doctors/1')
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('last_name');
      expect(response.body).toHaveProperty('specialization');
    });

    it('should return 404 for non-existent doctor', async () => {
      const response = await request(app)
        .get('/api/doctors/999')
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/doctors', () => {
    it('should create a new doctor when authenticated as admin', async () => {
      const newDoctor = {
        email: 'newdoctor@test.com',
        password: 'password123',
        first_name: 'New',
        last_name: 'Doctor',
        specialization: 'Pediatrician'
      };

      const response = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newDoctor);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.first_name).toBe(newDoctor.first_name);
      expect(response.body.last_name).toBe(newDoctor.last_name);
      expect(response.body.specialization).toBe(newDoctor.specialization);
    });

    it('should return 400 for invalid doctor data', async () => {
      const invalidDoctor = {
        email: 'invalid-email',
        password: '123',
        first_name: '',
        last_name: '',
        specialization: ''
      };

      const response = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidDoctor);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/doctors/:id', () => {
    it('should update doctor details when authenticated as the same doctor', async () => {
      const updateData = {
        first_name: 'Updated',
        last_name: 'Name',
        specialization: 'Updated Specialization'
      };

      const response = await request(app)
        .put('/api/doctors/1')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe(updateData.first_name);
      expect(response.body.last_name).toBe(updateData.last_name);
      expect(response.body.specialization).toBe(updateData.specialization);
    });

    it('should return 403 when trying to update another doctor', async () => {
      const updateData = {
        first_name: 'Unauthorized',
        last_name: 'Update',
        specialization: 'Unauthorized'
      };

      const response = await request(app)
        .put('/api/doctors/2')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });
  });
});

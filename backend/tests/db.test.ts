import mysql from 'mysql2/promise';

describe('Database Connection', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT)
    });
  });

  afterAll(async () => {
    await connection.end();
  });

  it('should connect to the database', async () => {
    const [rows] = await connection.query('SELECT 1');
    expect(rows).toBeDefined();
  });

  it('should have test users table', async () => {
    const [rows] = await connection.query('SELECT * FROM users');
    expect(Array.isArray(rows)).toBe(true);
  });

  it('should have test doctors table', async () => {
    const [rows] = await connection.query('SELECT * FROM doctors');
    expect(Array.isArray(rows)).toBe(true);
  });

  it('should have test patients table', async () => {
    const [rows] = await connection.query('SELECT * FROM patients');
    expect(Array.isArray(rows)).toBe(true);
  });
});

import dotenv from 'dotenv';
import path from 'path';
import mysql from 'mysql2/promise';
import fs from 'fs';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const setupTestDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
  });

  try {
    // Read and execute the fixtures SQL file
    const fixturesPath = path.join(__dirname, 'fixtures', 'fixtures.sql');
    const fixtures = fs.readFileSync(fixturesPath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = fixtures.split(';').filter(statement => statement.trim());
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

// Global setup
beforeAll(async () => {
  await setupTestDatabase();
});

// Global teardown
afterAll(async () => {
  // Clean up resources if needed
});

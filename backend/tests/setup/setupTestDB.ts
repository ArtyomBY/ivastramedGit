import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function setupTestDB() {
  try {
    console.log('Setting up test database...');
    await execAsync('mysql -u root -pscP4Fvp2 test_database < tests/fixtures/fixtures.sql');
    console.log('Test database setup complete.');
  } catch (error) {
    console.error('Error setting up test database:', error);
  }
}

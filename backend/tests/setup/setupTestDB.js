"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function setupTestDB() {
    try {
        console.log('Setting up test database...');
        await execAsync('mysql -u root -pscP4Fvp2 test_database < tests/fixtures/fixtures.sql');
        console.log('Test database setup complete.');
    }
    catch (error) {
        console.error('Error setting up test database:', error);
    }
}
exports.default = setupTestDB;
//# sourceMappingURL=setupTestDB.js.map
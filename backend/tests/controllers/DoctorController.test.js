"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const globals_1 = require("@jest/globals");
const mockAdminToken = jsonwebtoken_1.default.sign({ role: 'admin' }, process.env.JWT_SECRET || 'test_secret');
(0, globals_1.describe)('DoctorController', () => {
    (0, globals_1.it)('should get all doctors', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/doctors')
            .set('Authorization', `Bearer ${mockAdminToken}`);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(Array.isArray(response.body)).toBe(true);
    });
    (0, globals_1.it)('should get a doctor by ID', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/doctors/1')
            .set('Authorization', `Bearer ${mockAdminToken}`);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body).toHaveProperty('id', 1);
    });
});
//# sourceMappingURL=DoctorController.test.js.map
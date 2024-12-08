"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mockAdminToken = jsonwebtoken_1.default.sign({ role: 'admin' }, process.env.JWT_SECRET || 'test_secret');
describe('DocumentController', () => {
    it('should get all documents', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/documents')
            .set('Authorization', `Bearer ${mockAdminToken}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('should get a document by ID', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/documents/1')
            .set('Authorization', `Bearer ${mockAdminToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });
});
//# sourceMappingURL=DocumentController.test.js.map
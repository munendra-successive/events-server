"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_test_1 = __importDefault(require("./user.test"));
describe("Check app for health check and invalid routes", () => {
    it("should return 200 and a message", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default).get("/health-check");
        expect(res.status).toBe(200);
        expect(res.text).toEqual("Health is ok");
    });
    it("should return 404 and a message - url not found", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default).get("/hhgdshj");
        expect(res.status).toBe(404);
        expect(res.text).toEqual("URL not found");
    });
});

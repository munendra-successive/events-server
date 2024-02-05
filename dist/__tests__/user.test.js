"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const lib_1 = require("../lib");
const appInstance = new app_1.default();
const { app } = appInstance;
exports.default = app;
beforeAll(async () => {
    await appInstance.bootstrap();
    const res = await (0, supertest_1.default)(app)
        .post("/users/login")
        .send({ email: "monu@gmail.com", password: "Monu@123" });
    exports.token = res.body.tokenIs;
});
beforeEach(async () => {
    await lib_1.Connection.connectDb();
});
afterEach(async () => {
    await lib_1.Connection.disconnectDb();
});
describe("POST /users/login", () => {
    it("should return status 200,do not have token", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/users/login")
            .send({ email: "monu@gmail.com", password: "Monu@123" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
    });
    it("should return status 200, have valid token", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/users/login")
            .set("Authorization", `${exports.token}`)
            .send({ email: "monu@gmail.com", password: "Monu@123" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
    });
    it("should return status 403, if email not privided", async () => {
        const res = await (0, supertest_1.default)(app).post("/users/login");
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
    });
    it("should return status 403, have Invalid token", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/users/login")
            .set("Authorization", "eyJhbGciOiJIUzI1NiIsII6IkpXVCJ9.eyJlbWFpbCI6Im1vbnicGFzc3dvcmQiOiJNT251QDEyMyIsImlhdCI6MTcwNDY5MTMwNywiZXhwIjoxNzA0NjkzMTA3fQ.EKZgUaZqSy2BgMTUgBl7-Q22uA2K87EOJ0Db3_2cM84")
            .send({ email: "monu@gmail.com", password: "MOnu@123" });
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("message");
    });
    it("should return status 500", async () => {
        lib_1.Connection.disconnectDb();
        const res = await (0, supertest_1.default)(app)
            .post("/users/login")
            .send({ email: "abc@gmail.com", password: "abc@123" });
        expect(res.status).toBe(500);
        expect(res.body).toEqual(expect.any(Object));
    });
});
describe("POST /users/register", () => {
    it("should return status 200 and a message - registered successfully", async () => {
        const time = new Date().getTime().toString();
        const res = await (0, supertest_1.default)(app)
            .post("/users/register")
            .send({
            name: "monu",
            email: `monkumaru${time}@gmail.com`,
            password: "MOnu@123",
            address: "Delhi, India",
            phone: "7678467864",
        });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Registered Successfully" });
    });
    it("should return status 400", async () => {
        const time = new Date().getTime().toString();
        const res = await (0, supertest_1.default)(app).post("/users/register").send({
            name: "monu",
            password: "MOnu@123",
            address: "Delhi, India",
            phone: "7678467864",
        });
        expect(res.status).toBe(500);
        expect(res.body).toEqual(expect.any(Object));
    });
    it("should return status 409 and a message - user already registered", async () => {
        const res = await (0, supertest_1.default)(app).post("/users/register").send({
            name: "monu",
            email: "monu@gmail.com",
            password: "MOnu@123",
            address: "Delhi, India",
            phone: "7678467864",
        });
        expect(res.status).toBe(409);
        expect(res.body).toEqual({ message: "User already exist" });
    });
    it("should return status 500 ", async () => {
        lib_1.Connection.disconnectDb();
        const res = await (0, supertest_1.default)(app).post("/users/register").send({
            name: "monu",
            email: "monu@gmail.com",
            password: "MOnu@123",
            address: "Delhi, India",
            phone: "7678467864",
        });
        expect(res.status).toBe(500);
        expect(res.body).toEqual(expect.any(Object));
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_test_1 = __importDefault(require("./user.test"));
const lib_1 = require("../lib");
const path_1 = __importDefault(require("path"));
const user_test_2 = require("./user.test");
const expToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vbnVAZ21haWwuY29tIiwicGFzc3dvcmQiOiJNb251QDEyMyIsImlhdCI6MTcwNjYxNzEzNiwiZXhwIjoxNzA2NjE4OTM2fQ.a-ffijB5LmKP4L5z1SyrYaFeRifw7mVlLeQp-EnQeUI";
describe("POST /events/create", () => {
    it("should return status 200 if event added successfully", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .post("/events/create")
            .set("Authorization", `${user_test_2.token}`)
            .send({
            name: "Munendra Kushwaha",
            address: {
                street: "Madison Square Garden",
                city: "New York",
                state: "New York",
                postalCode: "10001",
                country: "USA",
            },
            description: "An event in noida",
            startDate: "2023-12-15",
            endDate: "2023-12-16",
            category: "Music",
            organizerInfo: "Live Nation",
            type: "Concert",
            status: "Limited tickets available",
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
    });
    it("should return status 500 if internal server error", async () => {
        await lib_1.Connection.disconnectDb();
        const res = await (0, supertest_1.default)(user_test_1.default)
            .post("/events/create")
            .set("Authorization", `${user_test_2.token}`)
            .send({
            name: "Munendra Kushwaha",
            address: {
                street: "Madison Square Garden",
                city: "New York",
                state: "New York",
                postalCode: "10001",
                country: "USA",
            },
            description: "An event in noida",
            startDate: "2023-12-15",
            endDate: "2023-12-16",
            category: "Music",
            organizerInfo: "Live Nation",
            type: "Concert",
            status: "Limited tickets available",
        });
        expect(res.status).toBe(500);
        expect(res.body).toEqual(expect.any(Object));
    });
});
describe("GET /events/get", () => {
    it("should return status 200 if query is not present", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/get")
            .set("Authorization", `${user_test_2.token}`)
            .query({ current: "1", pageSize: "10" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty("datalength");
        expect(res.body).toHaveProperty("data");
    });
    it("should return status 403 if token is expired", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/get")
            .set("Authorization", `${expToken}`)
            .query({ current: "1", pageSize: "10" });
        expect(res.status).toBe(403);
        expect(res.body).toEqual(expect.any(Object));
    });
    it("should return status 200 if query is Invalid", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/get")
            .set("Authorization", `${user_test_2.token}`)
            .query({ current: "1", pageSize: "hkjdfhjd" });
        expect(res.status).toBe(422);
    });
    it("should return status 200 and data if query is present and it is filter query", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/get")
            .set("Authorization", `${user_test_2.token}`)
            .query({ current: "1", pageSize: "10", query: "GameFilter" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty("datalength");
        expect(res.body).toHaveProperty("data");
    });
    it("should return status 200 and data if query is present and it is search query", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/get")
            .set("Authorization", `${user_test_2.token}`)
            .query({ current: "1", pageSize: "10", query: "Music" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty("datalength");
        expect(res.body).toHaveProperty("data");
    });
    it("should return status 500", async () => {
        await lib_1.Connection.disconnectDb();
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/get")
            .set("Authorization", `${user_test_2.token}`)
            .query({ current: "0", pageSize: "10" });
        expect(res.status).toBe(500);
        expect(res.body).toEqual(expect.any(Object));
    });
});
describe("GET /events/getBulk", () => {
    it("should return 200 and data ", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/getBulk")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty("data");
    });
    it("should return 500 ", async () => {
        lib_1.Connection.disconnectDb();
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/getBulk")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.body).toEqual(expect.any(Object));
    });
});
describe("GET /events/getById/:id", () => {
    it("should return status 200 and data", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/getById/65b3d13472636466772762df")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty("data");
    });
    it("should return status 404 and if no data is present", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/getById/65b3d0d8726364667727626f")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(404);
    });
    it("should return status 403 if no token", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default).get("/events/getById/65b3d0d87263646677276271");
        expect(res.status).toBe(403);
    });
    it("should return status 422 and if mongoId is Invalid", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/getById/65b3d0d8726364667727627")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(422);
    });
    it("should return status 500", async () => {
        await lib_1.Connection.disconnectDb();
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/getById/65ae0267d0dc76fce4e37600")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(500);
        expect(res.body).toEqual(expect.any(Object));
    });
});
describe("PUT /events/updateById/:id", () => {
    it("should return status 200 and data", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .put("/events/updateById/65b3d0d87263646677276283")
            .set("Authorization", `${user_test_2.token}`)
            .send({
            name: "Munendra Kushwaha",
            address: {
                street: "Madison Square Garden",
                city: "New York",
                state: "New York",
                postalCode: "10001",
                country: "USA",
            },
            description: "An event in noida",
            startDate: "2023-12-15",
            endDate: "2023-12-15",
            category: "Music",
            organizerInfo: "Live Nation",
            type: "Concert",
            status: "Limited tickets available",
        });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty("data");
    });
    it("should return status 422 and if id is invalid", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .put("/events/updateById/65b3d0d8726364667727628")
            .set("Authorization", `${user_test_2.token}`)
            .send({
            name: "Munendra Kushwaha",
            address: {
                street: "Madison Square Garden",
                city: "New York",
                state: "New York",
                postalCode: "10001",
                country: "USA",
            },
            description: "An event in noida",
            startDate: "2023-12-15",
            endDate: "2023-12-15",
            category: "Music",
            organizerInfo: "Live Nation",
            type: "Concert",
            status: "Limited tickets available",
        });
        expect(res.status).toBe(422);
    });
    it("should return status 500", async () => {
        lib_1.Connection.disconnectDb();
        const res = await (0, supertest_1.default)(user_test_1.default)
            .put("/events/updateById/658978c8b133a70e00173970")
            .set("Authorization", `${user_test_2.token}`)
            .send({
            name: "Munendra Kushwaha",
            address: {
                street: "Madison Square Garden",
                city: "New York",
                state: "New York",
                postalCode: "10001",
                country: "USA",
            },
            description: "An event in noida",
            startDate: "2023-12-15",
            endDate: "2023-12-15",
            category: "Music",
            organizerInfo: "Live Nation",
            type: "Concert",
            status: "Limited tickets available",
        });
        expect(res.status).toBe(500);
        expect(res.body).toEqual(expect.any(Object));
    });
});
describe("GET /events/deleteById/:id", () => {
    it("should return status 200 and data", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .delete("/events/deleteById/65ae0267d0dc76fce4e37602")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty("message");
    });
    it("should return status 422 and if is invalid", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .delete("/events/deleteById/65ae0267d0dc76fce4e3760")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(422);
    });
    it("should return status 500", async () => {
        lib_1.Connection.disconnectDb();
        const res = await (0, supertest_1.default)(user_test_1.default)
            .delete("/events/deleteById/658978c8b133a70e0017397a")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(500);
        expect(res.body).toEqual(expect.any(Object));
    });
});
describe("GET /events/getByUploadId/:uploadId", () => {
    it("should return status 200 and data", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/getByUploadId/1704394132190")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty("data");
    });
    it("should return status 500", async () => {
        lib_1.Connection.disconnectDb();
        const res = await (0, supertest_1.default)(user_test_1.default)
            .get("/events/getByUploadId/1704394132190")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(500);
        expect(res.body).toEqual(expect.any(Object));
    });
});
describe("POST /upload/csv", () => {
    const validCsvPath = path_1.default.join(__dirname, "..", "event_me.csv");
    it("should return status 200 and  success message when a CSV file is uploaded", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .post("/events/upload")
            .set("Authorization", `${user_test_2.token}`)
            .attach("csvFile", validCsvPath);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            data: null,
            datalength: null,
            message: "File uploaded Successfully",
            status: 200,
            success: true,
        });
    });
    it("should return status 400 and if no file provided", async () => {
        const res = await (0, supertest_1.default)(user_test_1.default)
            .post("/events/upload")
            .set("Authorization", `${user_test_2.token}`);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
    });
});

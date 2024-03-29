import request from "supertest";
import App from "../app";
import { Connection } from "../lib";

const appInstance: App = new App();
const { app } = appInstance;
export default app;
beforeAll(async () => {
  await appInstance.bootstrap();
  const res = await request(app)
    .post("/users/login")
    .send({ email: "monu@gmail.com", password: "Monu@123" });
  token = res.body.tokenIs;
});
export var token: string;
beforeEach(async () => {
  await Connection.connectDb();
});

afterEach(async () => {
  await Connection.disconnectDb();
});

describe("POST /users/login", () => {
  it("should return status 200,do not have token", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ email: "monu@gmail.com", password: "Monu@123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should return status 200, have valid token", async () => {
    const res = await request(app)
      .post("/users/login")
      .set("Authorization", `${token}`)
      .send({ email: "monu@gmail.com", password: "Monu@123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should return status 403, if email not privided", async () => {
    const res = await request(app).post("/users/login");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return status 403, have Invalid token", async () => {
    const res = await request(app)
      .post("/users/login")
      .set(
        "Authorization",
        "eyJhbGciOiJIUzI1NiIsII6IkpXVCJ9.eyJlbWFpbCI6Im1vbnicGFzc3dvcmQiOiJNT251QDEyMyIsImlhdCI6MTcwNDY5MTMwNywiZXhwIjoxNzA0NjkzMTA3fQ.EKZgUaZqSy2BgMTUgBl7-Q22uA2K87EOJ0Db3_2cM84"
      )
      .send({ email: "monu@gmail.com", password: "MOnu@123" });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  });

  it("should return status 500", async () => {
    Connection.disconnectDb();
    const res = await request(app)
      .post("/users/login")
      .send({ email: "abc@gmail.com", password: "abc@123" });
    expect(res.status).toBe(500);
    expect(res.body).toEqual(expect.any(Object));
  });
});

describe("POST /users/register", () => {
  it("should return status 200 and a message - registered successfully", async () => {
    const time = new Date().getTime().toString();
    const res = await request(app)
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
    const res = await request(app).post("/users/register").send({
      name: "monu",
      password: "MOnu@123",
      address: "Delhi, India",
      phone: "7678467864",
    });
    expect(res.status).toBe(500);
    expect(res.body).toEqual(expect.any(Object));
  });

  it("should return status 409 and a message - user already registered", async () => {
    const res = await request(app).post("/users/register").send({
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
    Connection.disconnectDb();
    const res = await request(app).post("/users/register").send({
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

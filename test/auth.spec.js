import app from "../server.js";
import request from "supertest";
import * as db from "./config/database.js";
import { expect, describe, beforeAll, afterAll, it } from "vitest";

const exampleUser = { email: "a@a.com", password: "123456" };
const saveUser = (user) => {
  return request(app).post("/api/auth/register").send(user);
};
let token = "Bearer ";

describe("Authentication Module", function () {
  beforeAll(async () => await db.connect());
  //afterEach(async () => await db.clear());
  afterAll(async () => await db.close());

  it("should return user after register", async function () {
    const res = await saveUser(exampleUser).expect(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(exampleUser.email);
    expect(res.body.user).not.toHaveProperty("password");
    token += res.body.token;
  });

  it("should not register with invalid email", async function () {
    const res = await saveUser({ email: "cvzvczv", password: "123456" }).expect(400);
    console.log(res.body);
    expect(res.body.status).toMatch(/fail/i);
  });

  it("should return user after login", async function () {
    const res = await request(app).post("/api/auth/login").send(exampleUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(exampleUser.email);
  });

  it("should fail login with wrong credentials", async function () {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "a@a.com", password: "1234567" });
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toMatch(/fail/i);
    expect(res.body).not.toHaveProperty("token");
  });

  it("should fail login with invalid fields", async function () {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "aa.com", password: "123456" });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toMatch(/fail/i);
    expect(res.body).not.toHaveProperty("token");
  });

  it("should fail login with email not registered", async function () {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "afafdafagsdfgxx@a.com", password: "123456" });
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toMatch(/fail/i);
    expect(res.body).not.toHaveProperty("token");
  });

  it("should return the token owner", async function () {
    const res = await request(app).get("/api/auth/me").set({ Authorization: token }).send();
    expect(res.statusCode).toBe(200);
    const { _id, shopping_lists, email } = res.body.user;
    expect(_id).toBeTruthy();
    expect(shopping_lists).toHaveLength(0);
    expect(email).toBeTruthy();
  });
});

import app from "../server.js";
import request from "supertest";
import * as db from "./config/database.js";
import { expect, describe, beforeAll, afterAll, it } from "vitest";

const exampleUser = { email: "a@a.com", password: "123456" };
const saveUser = (user) => {
  return request(app).post("/api/auth/register").send(user);
};
let token = "Bearer ";

describe("Category Module", function () {
  beforeAll(async () => {
    await db.connect();
    const res = await saveUser(exampleUser);
    token += res.body.token;
  });
  //afterEach(async () => await db.clear());
  afterAll(async () => await db.close());

  it("should return categories", async function () {
    const res = await request(app).get("/api/category").set({ Authorization: token }).expect(200);
    expect(res.body).toHaveProperty("categories");
  });

  it("should return 403 with invalid token", async function () {
    const res = await request(app)
      .get("/api/category")
      .set({ Authorization: "dfadfaga" })
      .expect(403);
    expect(res.body.status).toMatch(/fail/i);
  });

  it("should create new category with name at least 3 chars", async () => {
    const res = await request(app)
      .post("/api/category")
      .send({ name: "food" })
      .set({ Authorization: token })
      .expect(201);
    expect(res.body.category.name).toBe("food");
  });

  it("should return the category if already exists", async () => {
    const res = await request(app)
      .post("/api/category")
      .send({ name: "food" })
      .set({ Authorization: token })
      .expect(200);
    expect(res.body.category.name).toBe("food");
  });

  it("should return 400 with invalid name", async () => {
    const res = await request(app)
      .post("/api/category")
      .send({ name: "fo" })
      .set({ Authorization: token })
      .expect(400);
    expect(res.body.status).toMatch(/fail/i);
  });
});

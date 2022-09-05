import app from "../server.js";
import request from "supertest";
import * as db from "./config/database.js";
import { expect, describe, beforeAll, afterAll, it } from "vitest";

const exampleUser = { email: "a@a.com", password: "123456" };
const saveUser = (user) => {
  return request(app).post("/api/auth/register").send(user);
};
let token = "Bearer ";

describe("Statistics Module", function () {
  beforeAll(async () => {
    await db.connect();
    const res = await saveUser(exampleUser);
    token += res.body.token;
  });
  //afterEach(async () => await db.clear());
  afterAll(async () => await db.close());

  it("should return top items", async function () {
    const res = await request(app).get("/api/shoppinglist/topitems").set({ Authorization: token });
    expect(res.statusCode).toBe(200);
  });

  it("should return top categories", async function () {
    const res = await request(app)
      .get("/api/shoppinglist/topcategories")
      .set({ Authorization: token });
    expect(res.statusCode).toBe(200);
  });

  it("should return monthly stats", async function () {
    const res = await request(app).get("/api/shoppinglist/monthly").set({ Authorization: token });
    expect(res.statusCode).toBe(200);
  });
});

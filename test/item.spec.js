import app from "../server.js";
import request from "supertest";
import * as db from "./config/database.js";
import { expect, describe, beforeAll, it, afterAll } from "vitest";

const exampleUser = { email: "a@a.com", password: "123456" };
const otherUser = { email: "a2@a.com", password: "123456" };
const saveUser = (user) => {
  return request(app).post("/api/auth/register").send(user);
};
let token = "Bearer ";
let otherToken = "Bearer ";
let categoryIdToQuery = "";
let itemIdToQuery = "";

describe("Item Module", function () {
  beforeAll(async () => {
    await db.connect();
    const res = await saveUser(exampleUser);
    token += res.body.token;
    const otherRes = await saveUser(otherUser);
    otherToken += otherRes.body.token;
  });
  //afterEach(async () => await db.clear());
  afterAll(async () => await db.close());

  it("should return items", async function () {
    const res = await request(app).get("/api/item").set({ Authorization: token }).expect(200);
    //expect(res.body).toHaveProperty('items');
    expect(res.body.items.length).toBe(0);
  });

  it("should create new item and new category", async () => {
    const res = await request(app)
      .post("/api/item")
      .send({ name: "banana", category: "fruits" }) // without optional fields
      .set({ Authorization: token })
      .expect(201);
    expect(res.body.item.name).toBe("banana");
    expect(res.body.item.category.name).toBe("fruits");
    itemIdToQuery = res.body.item._id;
    categoryIdToQuery = res.body.item.category._id;
    expect(res.body.item.user).toBeTruthy();
  });

  it("should create item and find category by given name", async () => {
    const res = await request(app)
      .post("/api/item")
      .send({ name: "apple", category: "fruits" })
      .set({ Authorization: token })
      .expect(201);
    expect(res.body.item.name).toBe("apple");
    expect(res.body.item.category.name).toBe("fruits");
    expect(res.body.item.category._id).toBe(categoryIdToQuery);
  });

  it("should return 400 with invalid fields", async () => {
    const res = await request(app)
      .post("/api/item")
      .send({ name: "", category: "fruits" })
      .set({ Authorization: token })
      .expect(400);
    expect(res.body.status).toMatch(/fail/i);
  });

  it("should return an item by id", async () => {
    const res = await request(app)
      .get("/api/item/" + itemIdToQuery)
      .set({ Authorization: token })
      .expect(200);
    expect(res.body.item.name).toBe("banana");
  });

  it("should return 400 if id invalid", async () => {
    const res = await request(app)
      .get("/api/item/" + "somethinginvalid")
      .set({ Authorization: token })
      .expect(400);
    expect(res.body.status).toMatch(/fail/i);
  });

  it("should not delete item if id invalid mongoID", async () => {
    const res = await request(app)
      .delete("/api/item/" + "somethinginvalid")
      .set({ Authorization: token })
      .expect(400);
    expect(res.body.status).toMatch(/fail/i);
  });

  it("should not delete item of someone else", async () => {
    const res = await request(app)
      .delete("/api/item/" + itemIdToQuery)
      .set({ Authorization: otherToken })
      .expect(401);
    expect(res.body.status).toMatch(/fail/i);
  });

  it("should delete successfully", async () => {
    await request(app)
      .delete("/api/item/" + itemIdToQuery)
      .set({ Authorization: token })
      .expect(204);
  });
});

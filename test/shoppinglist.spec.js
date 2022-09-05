import app from "../server.js";
import request from "supertest";
import * as db from "./config/database.js";
import { expect, describe, beforeAll, afterAll, it } from "vitest";

const exampleUser = { email: "a@a.com", password: "123456" };
const otherUser = { email: "a2@a.com", password: "123456" };
const saveUser = (user) => {
  return request(app).post("/api/auth/register").send(user);
};
let token = "Bearer ";
let otherToken = "Bearer ";

const item1 = { name: "banana", category: "fruits" };
const item2 = { name: "shirt", category: "clothes" };
const item3 = { name: "apple", category: "fruits" };
let item1Id,
  item2Id,
  item3Id = "";

let listId = "";

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

  it("should create a new shopping list", async function () {
    const res1 = await request(app)
      .post("/api/item")
      .send(item1) // without optional fields
      .set({ Authorization: token })
      .expect(201);
    item1Id = res1.body.item._id;

    const res2 = await request(app)
      .post("/api/item")
      .send(item2) // without optional fields
      .set({ Authorization: token })
      .expect(201);
    item2Id = res2.body.item._id;

    const res3 = await request(app)
      .post("/api/item")
      .send(item3) // without optional fields
      .set({ Authorization: token })
      .expect(201);
    item3Id = res3.body.item._id;

    const listRes = await request(app)
      .post("/api/shoppinglist")
      .send({
        name: "demo shopping list",
        items: [
          { item: item1Id, amount: 2 },
          { item: item2Id, amount: 3 },
        ],
      })
      .set({ Authorization: token })
      .expect(201);

    expect(listRes.body._id).toBeTruthy();
    listId = listRes.body._id;
    expect(listRes.body.name).toBe("demo shopping list");
    expect(listRes.body.items.length).toBe(2);
    expect(listRes.body.status).toBe("active");
  });

  it("should not create with empty name", async () => {
    const res = await request(app)
      .post("/api/shoppinglist")
      .send({
        name: "",
        items: [
          { item: item1Id, amount: 2 },
          { item: item2Id, amount: 3 },
        ],
      })
      .set({ Authorization: token })
      .expect(400);
    expect(res.body.status).toBe("fail");
  });

  it("should get all shoppinglists of the user", async function () {
    const res = await request(app)
      .get("/api/shoppinglist")
      .set({ Authorization: token })
      .expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].items).toBeUndefined();
  });

  it("should get a shoppinglist by id", async function () {
    const res = await request(app)
      .get("/api/shoppinglist/" + listId)
      .set({ Authorization: token })
      .expect(200);
    expect(res.body._id).toBe(listId);
    expect(res.body.items.length).toBe(2);
  });

  it("should getting a list fail with an invalid id", async function () {
    const res = await request(app)
      .get("/api/shoppinglist/626be9d6c4a7500489c645ca")
      .set({ Authorization: token })
      .expect(404);
    expect(res.body.status).toBe("fail");
  });

  it("should getting a list give error with a gibberish id", async function () {
    const res = await request(app)
      .get("/api/shoppinglist/afadfagfag")
      .set({ Authorization: token })
      .expect(400);
    expect(res.body.status).toBe("fail");
  });

  it("should not give other users access", async function () {
    const res = await request(app)
      .get("/api/shoppinglist/" + listId)
      .set({ Authorization: otherToken })
      .expect(401);
    expect(res.body.status).toBe("fail");
  });

  it("should add in item successfully", async () => {
    const res = await request(app)
      .post("/api/shoppinglist/" + listId + "/additem")
      .send({ id: item3Id, amount: 4, done: true })
      .set({ Authorization: token })
      .expect(200);
    console.log(res.body.data.items);
    expect(res.body.data.items).toHaveLength(3);
  });
});

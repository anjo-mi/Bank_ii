import request from "supertest";
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import app from "../../server.js";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.DB_TEST_STR);
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /questions/byId", () => {
  it("retrieves question with valid ID and one category", async () => {
    const q = await request(app).post(
      "/questions/byId"
    ).send({id:"68c7685f53638305cdaca7ed"})
    expect(q.body.content).toEqual("Tell me about yourself");
    expect(q.body.categories.length).toEqual(1);
    expect(q.status).toEqual(200);
  });
});

describe("GET /question/byId (2 cats)", () => {
  it("retrieves question with valid ID and two categories", async () => {
    const q = await request(app).post(
      "/questions/byId"
    ).send({id:"68c7685f53638305cdaca7f7"})
    expect(q.body.content).toEqual("Explain what a closure is in JavaScript");
    expect(q.body.categories.length).toEqual(2);
    expect(q.status).toEqual(200);
  });
});

describe("GET /questions/byId", () => {
  it("reports 'not found' error", async () => {
    const q = await request(app).post(
      "/questions/byId"
    ).send({id:"68c76858305cdaca7f7"})
    expect(q.status).toEqual(404);
  });
});

import request from "supertest";
import mongoose from "mongoose";
import models from "../../models/index.js";
const { Category } = models;
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

describe("GET /categories", () => {
  it("retrieves categories", async () => {
    const response = await request(app).get("/categories");
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body.categories)).toBe(true);
  });
});

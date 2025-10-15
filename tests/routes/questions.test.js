import request from "supertest";
import mongoose from "mongoose";
import models from "../../models/index.js";
const { Question } = models;
import { jest } from "@jest/globals";
import app from "../../server.js";
import dotenv from "dotenv";
dotenv.config();
// beforeAll(async () => {
//   await mongoose.disconnect();
//   await mongoose.connect(process.env.DB_TEST_STR);
// });
// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("GET /questions", () => {
//   it("retrieves questions", async () => {
//     const response = await request(app).get("/questions");
//     // console.log({ response });s
//     expect(response.status).toEqual(200);
//     expect(Array.isArray(response.body.questions)).toBe(true);
//   });
// });
// describe("GET /questions/:id", () => {
//   it("retrieves questions", async () => {
//     const response = await request(app).get(
//       "/questions/68c36cc31b51088f9a5b4747"
//     );
//     expect(response.status).toEqual(200);
//   });
// });

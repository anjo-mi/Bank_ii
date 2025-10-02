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

// test question cat's have at least one of the requested categories
const hasMatch = (allQuestions, requestedCats ) => {
  if (!Array.isArray(requestedCats)) requestedCats = [requestedCats];
  requestedCats = new Set(requestedCats);
  return allQuestions.every(question => question.categories.some(cat => requestedCats.has(cat)));
}

// test all cat's of question match all requested categories
const exactMatch = (allQuestions, requestedCats) => {
  if (!Array.isArray(requestedCats)) requestedCats = [requestedCats];
  return allQuestions.every(question => requestedCats.every(cat => question.categories.includes(cat)));
}

// match any's
describe("POST /questions/byCategory", () => {
  it("neither matchAll nor matchAny, multiple categories\nall questions should have at least one matching category", async () => {
    const cats = ["Behavioral", "Problem Solving"];
    const q = await request(app).post("/questions/byCategory").send({
      categori: cats,
    })
    expect(hasMatch(q.body.allQuestions, cats)).toEqual(true);
    expect(q.status).toEqual(200);
  });
});

describe("POST /questions/byCategory", () => {
  it("matchAny selected, single category (string)\nall questions should have at least one matching category", async () => {
    const cats = "Behavioral";
    const matchAll = false;
    const q = await request(app).post("/questions/byCategory").send({
      categori: cats,
      matchAll,
    })
    console.log( q.body.allQuestions );
    expect(hasMatch(q.body.allQuestions, cats)).toEqual(true);
    expect(q.status).toEqual(200);
  });
});

describe("POST /questions/byCategory", () => {
  it("matchAny selected, single category (array)\nall questions should have at least one matching category", async () => {
    const cats = ["Behavioral"];
    const matchAll = false;
    const q = await request(app).post("/questions/byCategory").send({
      categori: cats,
      matchAll,
    })
    console.log( q.body.allQuestions );
    expect(hasMatch(q.body.allQuestions, cats)).toEqual(true);
    expect(q.status).toEqual(200);
  });
});


// match Alls
describe("POST /questions/byCategory", () => {
  it("matchAll selected, single category (array)\nall questions' categories should match requested categories", async () => {
    const cats = ["Behavioral"];
    const matchAll = true;
    const q = await request(app).post("/questions/byCategory").send({
      categori: cats,
      matchAll,
    })
    console.log( q.body.allQuestions );
    expect(exactMatch(q.body.allQuestions, cats)).toEqual(true);
    expect(q.status).toEqual(200);
  });
});

describe("POST /questions/byCategory", () => {
  it("matchAll selected, single category (string)\nall questions' categories should match requested categories", async () => {
    const cats = "Behavioral";
    const matchAll = true;
    const q = await request(app).post("/questions/byCategory").send({
      categori: cats,
      matchAll,
    })
    console.log( q.body.allQuestions );
    expect(exactMatch(q.body.allQuestions, cats)).toEqual(true);
    expect(q.status).toEqual(200);
  });
});

describe("POST /questions/byCategory", () => {
  it("matchAll selected, multiple categories\nall questions' categories should match requested categories", async () => {
    const cats = ["Behavioral", "Problem Solving"];
    const matchAll = true;
    const q = await request(app).post("/questions/byCategory").send({
      categori: cats,
      matchAll,
    })
    console.log( q.body.allQuestions );
    expect(exactMatch(q.body.allQuestions, cats)).toEqual(true);
    expect(q.status).toEqual(200);
  });
});
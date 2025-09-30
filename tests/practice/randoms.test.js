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

const hasMatch = (allQuestions, requestedCats ) => {
  if (!Array.isArray(requestedCats)) requestedCats = [requestedCats];
  requestedCats = new Set(requestedCats);
  return allQuestions.every(question => question.categories.some(cat => requestedCats.has(cat)));
}

describe("POST /practice/start", () => {
  it("category selection, requested amount too high\nall questions should have at least one matching category\namount should be 8\nsufficient should be false", async () => {
    const cats = ["Problem Solving", "React"];
    const q = await request(app).post("/practice/start").send({
      categori: cats,
      limit: 8,
    })
    expect(hasMatch(q.body.questions, cats)).toEqual(true);
    expect(q.body.requestedLength).toEqual(8);
    expect(q.body.sufficient).toEqual(false);
    expect(q.body.message).toEqual('Your search yielded 7 results, while the interview was intended to contain 8 questions. Would you like to proceed?');
    expect(q.status).toEqual(200);
  });
});

describe("POST /practice/start", () => {
  it("category selection, no requested amount\nall questions should have at least one matching category\ndefault amount should be 7\nsufficient should be false", async () => {
    const cats = ["Problem Solving"];
    const q = await request(app).post("/practice/start").send({
      categori: cats,
    })
    expect(hasMatch(q.body.questions, cats)).toEqual(true);
    expect(q.body.requestedLength).toEqual(7);
    expect(q.body.questions.length).toEqual(5);
    expect(q.body.sufficient).toEqual(false);
    expect(q.body.message).toEqual('Your search yielded 5 results, while the interview was intended to contain 7 questions. Would you like to proceed?');
    expect(q.status).toEqual(200);
  });
});

describe("POST /practice/start", () => {
  it("no category selection, no requested amount\nall questions should be eligible, should only get as many results as default\ndefault amount should be 7\nsufficient should be true", async () => {
    const cats = [];
    const q = await request(app).post("/practice/start").send({
      categori: cats,
    })
    // expect(hasMatch(q.body.questions, cats)).toEqual(true);
    expect(q.body.requestedLength).toEqual(7);
    expect(q.body.questions.length).toEqual(7);
    expect(q.body.message).toEqual(null);
    expect(q.body.sufficient).toEqual(true);
    expect(q.status).toEqual(200);
  });
});

describe("POST /practice/start", () => {
  it("category selection, requested amount\nonly matching questions should be eligible\nuser should be able to set limits\nsufficient should be true", async () => {
    const cats = ["Behavioral"];
    const limit = 3;
    const q = await request(app).post("/practice/start").send({
      categori: cats,
      limit,
    })
    expect(hasMatch(q.body.questions, cats)).toEqual(true);
    expect(q.body.requestedLength).toEqual(limit);
    expect(q.body.questions.length).toEqual(limit);
    expect(q.body.sufficient).toEqual(true);
    expect(q.body.message).toEqual(null);
    expect(q.status).toEqual(200);
  });
});

describe("POST /practice/start", () => {
  it("questions should appear in a random order", async () => {
    const cats = [];
    const limit = 6;

    for (let i = 0 ; i < 50 ; i++){
      const q1 = await request(app).post("/practice/start").send({
        categori: cats,
        limit
      })
      const q2 = await request(app).post("/practice/start").send({
        categori: cats,
        limit
      })
      expect(q1.body.questions.every((q,i) => q.content === q2.body.questions[i].content)).toEqual(false);
    }   
  });
});

describe("POST /practice/start", () => {
  it("questions should not repeat", async () => {
    const cats = [];
    const limit = 6;

    for (let i = 0 ; i < 50 ;i++){
      const q = await request(app).post("/practice/start").send({
        categori: cats,
        limit
      })
      expect(new Set(q.body.questions.map(qu => qu.content)).size).toEqual(q.body.questions.length);
    }
  });
});

import mongoose from "mongoose";
import models from "../../models/index.js";
const { Question } = models;
import { jest } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.DB_TEST_STR);
});
afterAll(async () => {
  // await Question.deleteMany({});
  await mongoose.connection.close();
});
// jest.useFakeTimers();

const question1 = {
  answer: "I love the culture",
  categories: ["Behavioral"],
  content: "why do you want to work for us?",
  def: true,
  res: `question "why work for us" with "i love the culture" and default: true should pass`,
};
const question2 = {
  categories: ["Behavioral"],
  content: "why do you want to work for us?",
  def: false,
  res: `question "why work for us" with no answer and default: false should pass`,
};
const question3 = {
  answer: "I love the culture",
  categories: ["Behavioral", "Vibe Check"],
  content: "why do you want to work for us?",
  def: true,
  res: `should be able to accept an array with multiple elements`,
};

test(question1.res, async () => {
  const q = question1;
  const quest = await Question.create({
    answer: q.answer || null,
    categories: q.categories,
    content: q.content,
    isDefault: q.def,
  });
  expect(quest.answer).toBe(q.answer);
  expect(quest.content).toBe(q.content);
  expect(quest.isDefault).toBe(q.def);
  expect(quest.categories).toEqual(q.categories);
  expect(quest).toHaveProperty("_id");
});

test(question2.res, async () => {
  const q = question2;
  const quest = await Question.create({
    answer: q.answer || null,
    categories: q.categories,
    content: q.content,
    isDefault: q.def,
  });
  expect(quest.answer).toBe(null);
  expect(quest.content).toBe(q.content);
  expect(quest.isDefault).toBe(q.def);
  expect(quest.categories).toEqual(q.categories);
  expect(quest).toHaveProperty("_id");
});

test(question3.res, async () => {
  const q = question3;
  const quest = await Question.create({
    answer: q.answer || null,
    categories: q.categories,
    content: q.content,
    isDefault: q.def,
  });
  expect(quest.answer).toBe(q.answer);
  expect(quest.content).toBe(q.content);
  expect(quest.isDefault).toBe(q.def);
  expect(quest.categories).toEqual(q.categories);
  expect(quest).toHaveProperty("_id");
});

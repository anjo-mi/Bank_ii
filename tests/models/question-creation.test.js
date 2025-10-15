import mongoose from "mongoose";
import models from "../../models/index.js";
const { Question, User } = models;
import { jest } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.DB_TEST_STR);
});
afterAll(async () => {
  await Question.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

test('questions can be created with a user ID and explicit FALSE default setting', async () => {
  const user = await User.create({
    email: 'myemail@myplace.com',
    username: 'myname',
    password: 'mypassword',
  });

  const question = await Question.create({
    title: '',
    content: 'why did the chicken cross the road?',
    categories: ["bad humor"],
    userId: user._id,
    isDefault: false
  });
  
  expect(question.userId).toBe(user._id);
  expect(question.isDefault).toBe(false);
});

test('NO explicit default setting will assume its false, and assign it to the user', async () => {
  const user = await User.create({
    email: 'mydadsemail@myplace.com',
    username: 'mynamejr',
    password: 'myveryownpassword',
  });

  const question = await Question.create({
    content: 'why are people the way we are',
    categories: ["philospohy"],
    userId: user._id,
  });
  
  expect(question.userId).toBe(user._id);
  expect(question.isDefault).toBe(false);
});

test('question can be created with an answer', async () => {
  const user = await User.create({
    email: 'mypoppopsemail@hisplace.com',
    username: 'myname3',
    password: 'handmedownpassword',
  });

  const question = await Question.create({
    content: 'does anything even matter',
    categories: ["existential"],
    userId: user._id,
    answer: 'of course things matter. even if it amounts to nothing, the feelings are real, so learn from bad ones, and share some good ones.',
    isDefault: true,
  });
  
  expect(question.userId).toBe(user._id);
  expect(question.isDefault).toBe(true);
});

test('default questions dont have a userId attached', async () => {
  const question = await Question.create({
    content: 'Test content',
    categories: ["someCategoryId"],
    isDefault: true,
  });
  
  expect(question.userId).toBeNull();
  expect(question.isDefault).toBe(true);
});
import mongoose from "mongoose";
import models from "../../models/index.js";
const { PracticeSession, Question, User } = models;
import { jest } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.DB_TEST_STR);
  
  await User.collection.dropIndexes();
  await Question.collection.dropIndexes();
  await PracticeSession.collection.dropIndexes();
  await User.syncIndexes();
  await Question.syncIndexes();
  await PracticeSession.syncIndexes();
  
  await User.deleteMany({});
  await Question.deleteMany({});
  await PracticeSession.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await Question.deleteMany({});
  await PracticeSession.deleteMany({});
  await mongoose.connection.close();
});

test('PracticeSession can be created with valid data', async () => {
  const user = await User.create({
    email: 'session@test.com',
    username: 'sessionuser',
    password: 'password123'
  });

  const question1 = await Question.create({
    content: 'Test question 1',
    categories: ['Technical'],
    isDefault: true
  });
  
  const question2 = await Question.create({
    content: 'Test question 2',
    categories: ['Behavioral'],
    isDefault: true
  });
  
  const session = await PracticeSession.create({
    userId: user._id,
    questions: [question1._id, question2._id],
    answers: ['Answer 1', 'Answer 2']
  });
  
  expect(session).toBeTruthy();
  expect(session.userId.toString()).toBe(user._id.toString());
  expect(session.questions.length).toBe(2);
  expect(session.answers.length).toBe(2);
  expect(session.completedAt).toBeTruthy();
  expect(session.aiResponse).toBeNull();
});

test('PracticeSession requires userId', async () => {
  const question = await Question.create({
    content: 'Test question',
    categories: ['Technical'],
    isDefault: true
  });
  
  await expect(PracticeSession.create({
    questions: [question._id],
    answers: ['Answer']
  })).rejects.toThrow();
});

test('PracticeSession requires questions array', async () => {
  const user = await User.create({
    email: 'noquestions@test.com',
    username: 'noquestionsuser',
    password: 'password123'
  });
  
  await expect(PracticeSession.create({
    userId: user._id,
    answers: ['Answer']
  })).rejects.toThrow();
});

test('PracticeSession requires answers array', async () => {
  const user = await User.create({
    email: 'noanswers@test.com',
    username: 'noansweruser',
    password: 'password123'
  });
  
  const question = await Question.create({
    content: 'Test question',
    categories: ['Technical'],
    isDefault: true
  });
  
  await expect(PracticeSession.create({
    userId: user._id,
    questions: [question._id]
  })).rejects.toThrow();
});

test('PracticeSession accepts empty string as answer', async () => {
  const user = await User.create({
    email: 'emptyanswer@test.com',
    username: 'emptyansweruser',
    password: 'password123'
  });
  
  const question = await Question.create({
    content: 'Test question',
    categories: ['Technical'],
    isDefault: true
  });
  
  const session = await PracticeSession.create({
    userId: user._id,
    questions: [question._id],
    answers: ['']
  });
    
  expect(session).toBeTruthy();
  expect(session.answers[0]).toBe('');
});

test('PracticeSession aiResponse defaults to null', async () => {
  const user = await User.create({
    email: 'aidefault@test.com',
    username: 'aidefaultuser',
    password: 'password123'
  });
  
  const question = await Question.create({
    content: 'Testing this question',
    categories: ['Technical'],
    isDefault: true
  });
  
  const session = await PracticeSession.create({
    userId: user._id,
    questions: [question._id],
    answers: ['Test answer']
  });
  
  expect(session.aiResponse).toBeNull();
});

test('PracticeSession completedAt defaults to current date', async () => {
  const user = await User.create({
    email: 'datedefault@test.com',
    username: 'datedefaultuser',
    password: 'password123'
  });
  
  const question = await Question.create({
    content: 'Test question',
    categories: ['Technical'],
    isDefault: true
  });
  
  const beforeCreate = new Date();
  
  const session = await PracticeSession.create({
    userId: user._id,
    questions: [question._id],
    answers: ['Test answer']
  });
  
  const afterCreate = new Date();
  
  expect(session.completedAt).toBeTruthy();
  expect(session.completedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
  expect(session.completedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
});

test('PracticeSession can store multiple questions and answers', async () => {
  const user = await User.create({
    email: 'multiple@test.com',
    username: 'multipleuser',
    password: 'password123'
  });
  
  const questions = await Question.insertMany([
    { content: 'Q1', categories: ['Technical'], isDefault: true },
    { content: 'Q2', categories: ['Behavioral'], isDefault: true },
    { content: 'Q3', categories: ['Leadership'], isDefault: true }
  ]);
  
  const session = await PracticeSession.create({
    userId: user._id,
    questions: questions.map(q => q._id),
    answers: ['Answer 1', 'Answer 2', 'Answer 3']
  });
  
  expect(session.questions.length).toBe(3);
  expect(session.answers.length).toBe(3);
});
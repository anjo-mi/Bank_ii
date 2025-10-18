import request from "supertest";
import mongoose from "mongoose";
import models from "../../models/index.js";
const { Question, Category, User } = models;
import { jest } from "@jest/globals";
import app from "../../server.js";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.DB_TEST_STR);
  
  await User.collection.dropIndexes();
  await Category.collection.dropIndexes();
  await Question.collection.dropIndexes();
  await User.syncIndexes();
  await Category.syncIndexes();
  await Question.syncIndexes();
  
  await User.deleteMany({});
  await Category.deleteMany({});
  await Question.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Question.deleteMany({});
  await mongoose.connection.close();
});

test('GET /questions/form after a valid login', async () => {
  const timestamp = Date.now();
  const user = await User.create({
    email: `create-form-${timestamp}@email.com`,
    username: `createform${timestamp}`,
    password: "randompass",
  });
  
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').send({
    provided: user.email,
    password: 'randompass'
  });
  
  expect(loginResponse.status).toBe(200);
  
  const response = await agent.get('/questions/form');
  
  expect(response.status).toBe(200);
  expect(response.text).toContain('<form');
  expect(response.text).toContain('textarea');
});

test('POST /questions/create creates question with valid data plus 1 new category', async () => {
  const timestamp = Date.now();
  const user = await User.create({
    email: `create-with-cat-${timestamp}@email.com`,
    username: `createwithcat${timestamp}`,
    password: "randompass",
  });

  const agent = request.agent(app);
  await agent.post('/auth/login').send({
    provided: user.username,
    password: "randompass",
  });
  
  const response = await agent
    .post('/questions/create')
    .send({
      question: `Question created at ${timestamp}`,
      categori: ["Behavioral", "Theoretical"],
      answer: 'Test answer',
      newCategories: 'VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULTTheoretical'
    });
  
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('question successfully added!');
  
  const createdQuestion = await Question.findOne({ content: `Question created at ${timestamp}` });
  expect(createdQuestion).toBeTruthy();
  expect(createdQuestion.userId.toString()).toBe(user._id.toString());
  expect(createdQuestion.categories.length).toBe(2);
  
  const createdCategory = await Category.findOne({ description: 'Theoretical', userId: user._id });
  expect(createdCategory).toBeTruthy();
  expect(createdCategory.isDefault).toBe(false);
});

test('POST /questions/create creates question with valid data, no answer, 1 category', async () => {
  const timestamp = Date.now();
  const user = await User.create({
    email: `create-no-answer-${timestamp}@email.com`,
    username: `createnoanswer${timestamp}`,
    password: "randompass",
  });

  const agent = request.agent(app);
  await agent.post('/auth/login').send({
    provided: user.username,
    password: "randompass",
  });
  
  const response = await agent
    .post('/questions/create')
    .send({
      question: `No answer question ${timestamp}`,
      categori: "Behavioral",
      newCategories: 'VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULTBehavioral'
    });
  
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('question successfully added!');
  
  const createdQuestion = await Question.findOne({ content: `No answer question ${timestamp}` });
  expect(createdQuestion).toBeTruthy();
  expect(createdQuestion.answer).toBe(null);
  expect(createdQuestion.userId.toString()).toBe(user._id.toString());
  expect(createdQuestion.categories.length).toBe(1);
  
  const createdCategory = await Category.findOne({ description: 'Behavioral', userId: user._id });
  expect(createdCategory).toBeTruthy();
});

test('POST /questions/create fails when trimmed content is empty', async () => {
  const timestamp = Date.now();
  const user = await User.create({
    email: `create-empty-${timestamp}@email.com`,
    username: `createempty${timestamp}`,
    password: "randompass",
  });

  const agent = request.agent(app);
  await agent.post('/auth/login').send({
    provided: user.username,
    password: "randompass",
  });
  
  const response = await agent
    .post('/questions/create')
    .send({
      question: '              ',
      categori: ["Behavioral"],
      newCategories: ''
    });
  
  expect(response.status).toBe(400);
  expect(response.body.message).toBe('questions need content');
});

test('POST /questions/create fails when no categories are selected', async () => {
  const timestamp = Date.now();
  const user = await User.create({
    email: `create-no-cat-${timestamp}@email.com`,
    username: `createnocat${timestamp}`,
    password: "randompass",
  });

  const agent = request.agent(app);
  await agent.post('/auth/login').send({
    provided: user.username,
    password: "randompass",
  });
  
  const response = await agent
    .post('/questions/create')
    .send({
      question: 'is this a legitimate question?',
      categori: undefined,
      newCategories: ''
    });
  
  expect(response.status).toBe(400);
  expect(response.body.message).toBe('questions each need at least 1 category');
});
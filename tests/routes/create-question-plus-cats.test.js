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
  await User.deleteMany({});
  await Category.collection.dropIndexes();
  await Category.syncIndexes();
  await Category.deleteMany({});
});
afterAll(async () => {
  await User.deleteMany({});
  await Category.collection.dropIndexes();
  await Category.syncIndexes();
  await Category.deleteMany({});
  await mongoose.connection.close();
});

test('GET /questions/form after a valid login', async () => {
  const user = await User.create({
    email: "my@email.com",
    username: "randomuser",
    password: "randompass",
  });
  const agent = request.agent(app);
  await agent.post('/auth/login').send({provided: user.email, password: 'randompass'});
  
  const response = await agent.get('/questions/form');
  
  expect(response.status).toBe(200);
  expect(response.text).toContain('<form');
  expect(response.text).toContain('textarea');
});

test('POST /questions/create creates question with valid data\n    plus 1 new cat', async () => {
  const user = await User.create({
    email: "diff@email.com",
    username: "this is different",
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
      question: 'What should my brand new question be?',
      categori: ["Behavioral", "Theoretical"],
      answer: 'If you havent figured it out yet, maybe give up.',
      newCategories: 'VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULTTheoretical'
    });
  
  expect(response.status).toBe(201);
  expect(response.body.quest).toHaveProperty('_id');
  expect(response.body.quest.content).toBe('What should my brand new question be?');
  expect(response.body.quest.answer).toBe('If you havent figured it out yet, maybe give up.');
  expect(response.body.quest.userId).toBe(user._id.toString());
  expect(response.body.quest.categories.length).toEqual(2);
  expect(response.body.cs.length).toEqual(1);
});

test('POST /questions/create creates question with valid data, no answer, 1 category\n    category is duplicate of default (still works)', async () => {
  const user = await User.create({
    email: "different@email.com",
    username: "this is diff",
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
      question: 'What should my brand new question be?',
      categori: "Behavioral",
      newCategories: 'VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULTBehavioral'
    });
  
  expect(response.status).toBe(201);
  expect(response.body.quest).toHaveProperty('_id');
  expect(response.body.quest.content).toBe('What should my brand new question be?');
  expect(response.body.quest.answer).toBe(null);
  expect(response.body.quest.userId).toBe(user._id.toString());
  expect(response.body.quest.categories.length).toEqual(1);
  expect(response.body.cs.length).toEqual(1);
});

test('POST /questions/create fails when trimmed content is empty', async () => {
  const user = await User.create({
    email: "notothers@email.com",
    username: "notothers",
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
  const user = await User.create({
    email: "onlyme@email.com",
    username: "notanyoneelse",
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
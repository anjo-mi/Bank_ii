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
});
afterAll(async () => {
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

test('POST /questions/create creates question with valid data', async () => {
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
      answer: 'If you havent figured it out yet, maybe give up.'
    });
  
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('_id');
  expect(response.body.content).toBe('What should my brand new question be?');
  expect(response.body.answer).toBe('If you havent figured it out yet, maybe give up.');
  expect(response.body.userId).toBe(user._id.toString());
  expect(response.body.categories.length).toEqual(2);
});

test('POST /questions/create creates question with valid data, no answer, 1 category', async () => {
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
    });
  
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('_id');
  expect(response.body.content).toBe('What should my brand new question be?');
  expect(response.body.answer).toBe(null);
  expect(response.body.userId).toBe(user._id.toString());
  expect(response.body.categories.length).toEqual(1);
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
    });
  
  expect(response.status).toBe(400);
  expect(response.body.message).toBe('questions each need at least 1 category');
});
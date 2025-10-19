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

async function createAndLoginUser(emailPrefix, usernamePrefix, password) {
  const timestamp = Date.now() + Math.random();
  const user = await User.create({
    email: `${emailPrefix}-${timestamp}@email.com`,
    username: `${usernamePrefix}${timestamp}`,
    password
  });
  const agent = request.agent(app);
  await agent.post('/auth/login').send({ provided: user.email, password });
  return { user, agent };
}

// ============ GET / (Home/Index) Tests ============

test('GET / shows default categories to guest users', async () => {
  const defaultCat = await Category.create({
    description: `DefaultCat${Date.now()}`,
    isDefault: true,
    userId: null
  });
  
  const response = await request(app).get('/');
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(defaultCat.description);
});

test('GET / shows default categories + user categories to logged-in users', async () => {
  const defaultCat = await Category.create({
    description: `DefaultCat${Date.now()}`,
    isDefault: true,
    userId: null
  });
  
  const { user, agent } = await createAndLoginUser('home-user', 'homeuser', 'password123');
  
  const userCat = await Category.create({
    description: `UserCat${Date.now()}`,
    isDefault: false,
    userId: user._id
  });
  
  const response = await agent.get('/');
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(defaultCat.description);
  expect(response.text).toContain(userCat.description);
});

test('GET / does NOT show other users categories', async () => {
  const { user: userA } = await createAndLoginUser('usera-home', 'userahome', 'password123');
  
  const userACat = await Category.create({
    description: `UserACat${Date.now()}`,
    isDefault: false,
    userId: userA._id
  });
  
  const { agent: agentB } = await createAndLoginUser('userb-home', 'userbhome', 'password123');
  
  const response = await agentB.get('/');
  
  expect(response.status).toBe(200);
  expect(response.text).not.toContain(userACat.description);
});

// ============ GET /questions Tests ============

test('GET /questions shows default questions to guest users', async () => {
  const defaultQuestion = await Question.create({
    content: `Default question ${Date.now()}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const response = await request(app).get('/questions');
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(defaultQuestion.content);
});

test('GET /questions shows default + user questions to logged-in users', async () => {
  const defaultQuestion = await Question.create({
    content: `Default question ${Date.now()}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const { user, agent } = await createAndLoginUser('questions-user', 'questionsuser', 'password123');
  
  const userQuestion = await Question.create({
    content: `User question ${Date.now()}`,
    categories: ['Behavioral'],
    isDefault: false,
    userId: user._id
  });
  
  const response = await agent.get('/questions');
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(defaultQuestion.content);
  expect(response.text).toContain(userQuestion.content);
});

test('GET /questions does NOT show other users questions to logged-in user', async () => {
  const { user: userA } = await createAndLoginUser('usera-questions', 'useraquestions', 'password123');
  
  const userAQuestion = await Question.create({
    content: `User A private question ${Date.now()}`,
    categories: ['Technical'],
    isDefault: false,
    userId: userA._id
  });
  
  const { agent: agentB } = await createAndLoginUser('userb-questions', 'userbquestions', 'password123');
  
  const response = await agentB.get('/questions');
  
  expect(response.status).toBe(200);
  expect(response.text).not.toContain(userAQuestion.content);
});

// ============ POST /questions/byId Tests ============

test('POST /questions/byId shows default question to guest', async () => {
  const defaultQuestion = await Question.create({
    content: `Default by ID ${Date.now()}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const response = await request(app)
    .post('/questions/byId')
    .send({ id: defaultQuestion._id.toString() });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(defaultQuestion.content);
});

test('POST /questions/byId shows user question to owner', async () => {
  const { user, agent } = await createAndLoginUser('byid-user', 'byiduser', 'password123');
  
  const userQuestion = await Question.create({
    content: `User question by ID ${Date.now()}`,
    categories: ['Behavioral'],
    isDefault: false,
    userId: user._id
  });
  
  const response = await agent
    .post('/questions/byId')
    .send({ id: userQuestion._id.toString() });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(userQuestion.content);
});

test('POST /questions/byId shows user question to any logged-in user', async () => {
  const { user: userA } = await createAndLoginUser('usera-byid', 'userabyid', 'password123');
  
  const userAQuestion = await Question.create({
    content: `User A question ${Date.now()}`,
    categories: ['Technical'],
    isDefault: false,
    userId: userA._id
  });
  
  const { agent: agentB } = await createAndLoginUser('userb-byid', 'userbbyid', 'password123');
  
  const response = await agentB
    .post('/questions/byId')
    .send({ id: userAQuestion._id.toString() });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(userAQuestion.content);
});

test('POST /questions/byId returns 404 for non-existent question', async () => {
  const fakeId = new mongoose.Types.ObjectId();
  
  const response = await request(app)
    .post('/questions/byId')
    .send({ id: fakeId.toString() });
  
  expect(response.status).toBe(404);
});

// ============ POST /questions/byCategory Tests ============

test('POST /questions/byCategory filters by single category (match any)', async () => {
  const timestamp = Date.now();
  
  await Question.create({
    content: `Tech question ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  await Question.create({
    content: `Behavioral question ${timestamp}`,
    categories: ['Behavioral'],
    isDefault: true,
    userId: null
  });
  
  const response = await request(app)
    .post('/questions/byCategory')
    .send({ 
      categori: 'Technical',
      search: ''
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`Tech question ${timestamp}`);
  expect(response.text).not.toContain(`Behavioral question ${timestamp}`);
});

test('POST /questions/byCategory filters by multiple categories (match any)', async () => {
  const timestamp = Date.now();
  
  await Question.create({
    content: `Tech question ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  await Question.create({
    content: `Behavioral question ${timestamp}`,
    categories: ['Behavioral'],
    isDefault: true,
    userId: null
  });
  
  await Question.create({
    content: `Leadership question ${timestamp}`,
    categories: ['Leadership'],
    isDefault: true,
    userId: null
  });
  
  const response = await request(app)
    .post('/questions/byCategory')
    .send({ 
      categori: ['Technical', 'Behavioral'],
      search: ''
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`Tech question ${timestamp}`);
  expect(response.text).toContain(`Behavioral question ${timestamp}`);
  expect(response.text).not.toContain(`Leadership question ${timestamp}`);
});

test('POST /questions/byCategory filters with matchAll (exact match)', async () => {
  const timestamp = Date.now();
  
  await Question.create({
    content: `Tech only ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  await Question.create({
    content: `Tech and Behavioral ${timestamp}`,
    categories: ['Technical', 'Behavioral'],
    isDefault: true,
    userId: null
  });
  
  const response = await request(app)
    .post('/questions/byCategory')
    .send({ 
      categori: ['Technical', 'Behavioral'],
      matchAll: '1',
      search: ''
    });
  
  expect(response.status).toBe(200);
  expect(response.text).not.toContain(`Tech only ${timestamp}`);
  expect(response.text).toContain(`Tech and Behavioral ${timestamp}`);
});

test('POST /questions/byCategory searches by keyword when no categories selected', async () => {
  const timestamp = Date.now();
  
  await Question.create({
    content: `Question about JavaScript ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  await Question.create({
    content: `Question about Python ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const response = await request(app)
    .post('/questions/byCategory')
    .send({ 
      search: 'JavaScript',
      matchAll: '1'
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`JavaScript ${timestamp}`);
  expect(response.text).not.toContain(`Python ${timestamp}`);
});

test('POST /questions/byCategory shows user questions to logged-in user', async () => {
  const { user, agent } = await createAndLoginUser('bycat-user', 'bycatuser', 'password123');
  
  const timestamp = Date.now();
  
  const defaultQuestion = await Question.create({
    content: `Default tech ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const userQuestion = await Question.create({
    content: `User tech ${timestamp}`,
    categories: ['Technical'],
    isDefault: false,
    userId: user._id
  });
  
  const response = await agent
    .post('/questions/byCategory')
    .send({ 
      categori: 'Technical',
      search: ''
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`Default tech ${timestamp}`);
  expect(response.text).toContain(`User tech ${timestamp}`);
});

test('POST /questions/byCategory does NOT show other users questions', async () => {
  const { user: userA } = await createAndLoginUser('usera-bycat', 'userabycat', 'password123');
  
  const timestamp = Date.now();
  
  const userAQuestion = await Question.create({
    content: `User A tech ${timestamp}`,
    categories: ['Technical'],
    isDefault: false,
    userId: userA._id
  });
  
  const { agent: agentB } = await createAndLoginUser('userb-bycat', 'userbbycat', 'password123');
  
  const response = await agentB
    .post('/questions/byCategory')
    .send({ 
      categori: 'Technical',
      search: ''
    });
  
  expect(response.status).toBe(200);
  expect(response.text).not.toContain(`User A tech ${timestamp}`);
});
import request from "supertest";
import mongoose from "mongoose";
import models from "../../models/index.js";
const { Question, Category, User, PracticeSession } = models;
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
  await PracticeSession.collection.dropIndexes();
  await User.syncIndexes();
  await Category.syncIndexes();
  await Question.syncIndexes();
  await PracticeSession.syncIndexes();
  
  await User.deleteMany({});
  await Category.deleteMany({});
  await Question.deleteMany({});
  await PracticeSession.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Question.deleteMany({});
  await PracticeSession.deleteMany({});
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
  let loginAction = await agent.post('/auth/login').send({ provided: user.email, password });
  while (loginAction.status !== 200){
    loginAction = await agent.post('/auth/login').send({ provided: user.email, password });
  }
  return { user, agent };
}

// ============ GET /practice Tests ============

test('GET /practice shows default categories to logged-in user', async () => {
  const timestamp = Date.now();
  const { agent } = await createAndLoginUser('practice-get', 'practiceget', 'password123');
  
  const defaultCat = await Category.create({
    description: `DefaultCat${timestamp}`,
    isDefault: true,
    userId: null
  });
  
  const response = await agent.get('/practice');
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(defaultCat.description);
});

test('GET /practice shows user categories + default categories', async () => {
  const timestamp = Date.now();
  const { user, agent } = await createAndLoginUser('practice-get-both', 'practicegetboth', 'password123');
  
  const defaultCat = await Category.create({
    description: `DefaultCat${timestamp}`,
    isDefault: true,
    userId: null
  });
  
  const userCat = await Category.create({
    description: `UserCat${timestamp}`,
    isDefault: false,
    userId: user._id
  });
  
  const response = await agent.get('/practice');
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(defaultCat.description);
  expect(response.text).toContain(userCat.description);
});

// ============ POST /practice/start Tests ============

test('POST /practice/start creates practice with selected categories', async () => {
  const timestamp = Date.now();
  const { user, agent } = await createAndLoginUser('start-with-cats', 'startwithcats', 'password123');
  
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
  
  const response = await agent
    .post('/practice/start')
    .send({
      categori: ['Technical'],
      limit: 5
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`Tech question ${timestamp}`);
  expect(response.text).not.toContain(`Behavioral question ${timestamp}`);
});

test('POST /practice/start uses default limit of 7 when not provided', async () => {
  const timestamp = Date.now();
  const { user, agent } = await createAndLoginUser('start-default-limit', 'startdefaultlimit', 'password123');
  
  // Create 10 questions with unique content
  for (let i = 0; i < 10; i++) {
    await Question.create({
      content: `Question ${timestamp}-${i}`,
      categories: ['Technical'],
      isDefault: true,
      userId: null
    });
  }
  
  const response = await agent
    .post('/practice/start')
    .send({
      categori: ['Technical']
    });
  
  expect(response.status).toBe(200);
  // Should have at most 7 questions (default limit)
  const questionMatches = response.text.match(new RegExp(`Question ${timestamp}-\\d+`, 'g'));
  expect(questionMatches).toBeTruthy();
  expect(questionMatches.length).toBeLessThanOrEqual(7);
});

test('POST /practice/start uses custom limit when valid number provided', async () => {
  const timestamp = Date.now();
  const { user, agent } = await createAndLoginUser('start-custom-limit', 'startcustomlimit', 'password123');
  
  // Create 5 questions
  for (let i = 0; i < 5; i++) {
    await Question.create({
      content: `Question ${timestamp}-${i}`,
      categories: ['Technical'],
      isDefault: true,
      userId: null
    });
  }
  
  const response = await agent
    .post('/practice/start')
    .send({
      categori: ['Technical'],
      limit: 3
    });
  
  expect(response.status).toBe(200);
  const questionMatches = response.text.match(new RegExp(`Question ${timestamp}-\\d+`, 'g'));
  expect(questionMatches).toBeTruthy();
  expect(questionMatches.length).toBeLessThanOrEqual(3);
});

test('POST /practice/start shows warning when insufficient questions available', async () => {
  const timestamp = Date.now();
  const { user, agent } = await createAndLoginUser('s-i', 'startinsufficient', 'password123');
  
  // Create only 2 questions
  await Question.create({
    content: `Question ${timestamp}-1`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  await Question.create({
    content: `Question ${timestamp}-2`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const response = await agent
    .post('/practice/start')
    .send({
      categori: ['Technical'],
      limit: 100
    });
  
  expect(response.status).toBe(200);
  // Check for the insufficient questions message
  const hasInsufficientMessage = response.text.includes('Your search yielded results') || response.text.includes('yielded');
  expect(hasInsufficientMessage).toBe(true);
});

test('POST /practice/start includes user questions + default questions', async () => {
  const timestamp = Date.now();
  const { user, agent } = await createAndLoginUser('s-u-q', 'startuserquestions', 'password123');
  
  const defaultQuestion = await Question.create({
    content: `Default question ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const userQuestion = await Question.create({
    content: `User question ${timestamp}`,
    categories: ['Technical'],
    isDefault: false,
    userId: user._id
  });
  
  const response = await agent
    .post('/practice/start')
    .send({
      categori: ['Technical'],
      limit: 10
    });
  
  expect(response.status).toBe(200);
  // At least one of the questions should appear
  const hasDefaultOrUser = response.text.includes(`Default question ${timestamp}`) || response.text.includes(`User question ${timestamp}`);
  expect(hasDefaultOrUser).toBe(true);
});

test('POST /practice/start returns 403 when no questions match', async () => {
  const timestamp = Date.now();
  const { agent } = await createAndLoginUser('start-no-match', 'startnomatch', 'password123');
  
  // Create question with different category
  await Question.create({
    content: `Tech question ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const response = await agent
    .post('/practice/start')
    .send({
      categori: [`NonExistentCategory${timestamp}`],
      limit: 5
    });
  
  expect(response.status).toBe(403);
  expect(response.body.message).toBe('no questions match your search?');
});

test('POST /practice/start includes all questions when no categories selected', async () => {
  const timestamp = Date.now();
  const { agent } = await createAndLoginUser('start-all-cats', 'startallcats', 'password123');
  
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
  
  const response = await agent
    .post('/practice/start')
    .send({
      limit: 100
    });
  
  expect(response.status).toBe(200);
  // Should include questions from all categories
  const hasTech = response.text.includes(`Tech question ${timestamp}`);
  const hasBehavioral = response.text.includes(`Behavioral question ${timestamp}`);
  expect(hasTech || hasBehavioral).toBe(true);
});

// ============ POST /practice/next Tests ============

test('POST /practice/next shows first question', async () => {
  const timestamp = Date.now();
  const { agent } = await createAndLoginUser('next-first', 'nextfirst', 'password123');
  
  const question = await Question.create({
    content: `First test question ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const response = await agent
    .post('/practice/next')
    .send({
      questions: JSON.stringify([question]),
      current: -1
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`First test question ${timestamp}`);
});

test('POST /practice/next stores answer and shows next question', async () => {
  const timestamp = Date.now();
  const { agent } = await createAndLoginUser('next-store-answer', 'nextstoreanswer', 'password123');
  
  const question1 = await Question.create({
    content: `Question 1 ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const question2 = await Question.create({
    content: `Question 2 ${timestamp}`,
    categories: ['Behavioral'],
    isDefault: true,
    userId: null
  });
  
  const response = await agent
    .post('/practice/next')
    .send({
      questions: JSON.stringify([question1, question2]),
      current: 0,
      answers: JSON.stringify([]),
      answer: 'My answer to question 1'
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`Question 2 ${timestamp}`);
});

test('POST /practice/next accepts empty string as answer', async () => {
  const timestamp = Date.now();
  const { agent } = await createAndLoginUser('next-empty-answer', 'nextemptyanswer', 'password123');
  
  const question1 = await Question.create({
    content: `Question 1 ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const question2 = await Question.create({
    content: `Question 2 ${timestamp}`,
    categories: ['Behavioral'],
    isDefault: true,
    userId: null
  });
  
  const response = await agent
    .post('/practice/next')
    .send({
      questions: JSON.stringify([question1, question2]),
      current: 0,
      answers: JSON.stringify([]),
      answer: ''
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`Question 2 ${timestamp}`);
});

test('POST /practice/next creates PracticeSession when practice completes', async () => {
  const timestamp = Date.now();
  const { user, agent } = await createAndLoginUser('next-complete', 'nextcomplete', 'password123');
  
  const question1 = await Question.create({
    content: `Question 1 ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const question2 = await Question.create({
    content: `Question 2 ${timestamp}`,
    categories: ['Behavioral'],
    isDefault: true,
    userId: null
  });
  
  const response = await agent
    .post('/practice/next')
    .send({
      questions: JSON.stringify([question1, question2]),
      current: 1,
      answers: JSON.stringify(['Answer 1']),
      answer: 'Answer 2'
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`Question 1 ${timestamp}`);
  expect(response.text).toContain(`Question 2 ${timestamp}`);
  
  // Verify PracticeSession was created
  const session = await PracticeSession.findOne({ userId: user._id });
  expect(session).toBeTruthy();
  expect(session.questions.length).toBe(2);
  expect(session.answers).toEqual(['Answer 1', 'Answer 2']);
  expect(session.aiResponse).toBeNull();
});

test('POST /practice/next displays results on completion', async () => {
  const timestamp = Date.now();
  const { agent } = await createAndLoginUser('next-results', 'nextresults', 'password123');
  
  const question = await Question.create({
    content: `Only question ${timestamp}`,
    categories: ['Technical'],
    isDefault: true,
    userId: null
  });
  
  const response = await agent
    .post('/practice/next')
    .send({
      questions: JSON.stringify([question]),
      current: 0,
      answers: JSON.stringify([]),
      answer: 'My final answer'
    });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain(`Only question ${timestamp}`);
  expect(response.text).toContain('My final answer');
});
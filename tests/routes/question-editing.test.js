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
  const timestamp = Date.now() + Math.random(); // Extra uniqueness
  const user = await User.create({
    email: `${emailPrefix}-${timestamp}@email.com`,
    username: `${usernamePrefix}${timestamp}`,
    password
  });
  const agent = request.agent(app);
  await agent.post('/auth/login').send({ provided: user.email, password });
  return { user, agent };
}

test('Owner can update question content only', async () => {
  const { user, agent } = await createAndLoginUser('edit-content', 'editcontent', 'password123');
  
  const question = await Question.create({
    content: `Original question ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Original answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: 'Updated question content',
      categori: ['Technical'],
      answer: 'Original answer'
    });

  expect(response.status).toBe(302);
  expect(response.header.location).toBe('/questions/edit/select');
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.content).toBe('Updated question content');
  expect(updatedQuestion.answer).toBe('Original answer');
});

test('Owner can update answer only', async () => {
  const { user, agent } = await createAndLoginUser('edit-answer', 'editanswer', 'password123');
  
  const question = await Question.create({
    content: `Test question ${Date.now()}`,
    categories: ['Behavioral'],
    answer: 'Original answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: question.content,
      categori: ['Behavioral'],
      answer: 'Updated answer'
    });

  expect(response.status).toBe(302);
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.answer).toBe('Updated answer');
});

test('Owner can update both question and answer', async () => {
  const { user, agent } = await createAndLoginUser('edit-both', 'editboth', 'password123');
  
  const question = await Question.create({
    content: `Original ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Original answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: 'Updated question',
      categori: ['Technical'],
      answer: 'Updated answer'
    });

  expect(response.status).toBe(302);
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.content).toBe('Updated question');
  expect(updatedQuestion.answer).toBe('Updated answer');
});

test('Owner can update categories only', async () => {
  const { user, agent } = await createAndLoginUser('edit-cats', 'editcats', 'password123');
  
  const question = await Question.create({
    content: `Test ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Test answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: question.content,
      categori: ['Behavioral', 'Leadership'],
      answer: 'Test answer'
    });

  expect(response.status).toBe(302);
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.categories).toEqual(['Behavioral', 'Leadership']);
});

test('Owner can update categories and question', async () => {
  const { user, agent } = await createAndLoginUser('edit-catquest', 'editcatquest', 'password123');
  
  const question = await Question.create({
    content: `Original ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Test answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: 'Updated question',
      categori: ['Behavioral'],
      answer: 'Test answer'
    });

  expect(response.status).toBe(302);
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.content).toBe('Updated question');
  expect(updatedQuestion.categories).toEqual(['Behavioral']);
});

test('Owner can update categories, question, and answer', async () => {
  const { user, agent } = await createAndLoginUser('edit-all', 'editall', 'password123');
  
  const question = await Question.create({
    content: `Original ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Original answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: 'Completely updated question',
      categori: ['Leadership', 'Communication'],
      answer: 'Completely updated answer'
    });

  expect(response.status).toBe(302);
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.content).toBe('Completely updated question');
  expect(updatedQuestion.categories).toEqual(['Leadership', 'Communication']);
  expect(updatedQuestion.answer).toBe('Completely updated answer');
});

test('Owner can remove answer (set to null)', async () => {
  const { user, agent } = await createAndLoginUser('edit-remove', 'editremove', 'password123');
  
  const question = await Question.create({
    content: `Test ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Original answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: question.content,
      categori: ['Technical'],
      answer: ''
    });

  expect(response.status).toBe(302);
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.answer).toBe(null);
});

test('Owner can change from 1 category to multiple', async () => {
  const { user, agent } = await createAndLoginUser('edit-onetomany', 'editonetomany', 'password123');
  
  const question = await Question.create({
    content: `Test ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Test answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: question.content,
      categori: ['Technical', 'Behavioral', 'Leadership'],
      answer: 'Test answer'
    });

  expect(response.status).toBe(302);
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.categories.length).toBe(3);
});

test('Owner can change from multiple categories to 1', async () => {
  const { user, agent } = await createAndLoginUser('edit-manytoone', 'editmanytoone', 'password123');
  
  const question = await Question.create({
    content: `Test ${Date.now()}`,
    categories: ['Technical', 'Behavioral', 'Leadership'],
    answer: 'Test answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: question.content,
      categori: 'Technical',
      answer: 'Test answer'
    });

  expect(response.status).toBe(302);
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.categories).toEqual(['Technical']);
});

test('Non-owner cannot update question (403)', async () => {
  const timestamp = Date.now();
  const owner = await User.create({
    email: `owner-${timestamp}@email.com`,
    username: `owner${timestamp}`,
    password: 'password123'
  });
  
  const question = await Question.create({
    content: `Owner question ${timestamp}`,
    categories: ['Technical'],
    answer: 'Owner answer',
    userId: owner._id,
    isDefault: false
  });

  const { agent } = await createAndLoginUser('edit-attacker', 'editattacker', 'password123');

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: 'Malicious update',
      categori: ['Technical'],
      answer: 'Hacked'
    });

  expect(response.status).toBe(403);
  
  const unchangedQuestion = await Question.findById(question._id);
  expect(unchangedQuestion.content).toBe(`Owner question ${timestamp}`);
});

test('Update fails when no categories provided', async () => {
  const { user, agent } = await createAndLoginUser('edit-nocat', 'editnocat', 'password123');
  
  const question = await Question.create({
    content: `Test ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Test answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: 'Updated question',
      categori: undefined,
      answer: 'Test answer'
    });

  expect(response.status).toBe(404);
});

test('Update fails when question content is empty', async () => {
  const { user, agent } = await createAndLoginUser('edit-empty', 'editempty', 'password123');
  
  const question = await Question.create({
    content: `Test ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Test answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: question._id.toString(),
      question: '          ',
      categori: ['Technical'],
      answer: 'Test answer'
    });

  expect(response.status).toBe(404);
});

test('Update fails when question does not exist', async () => {
  const { agent } = await createAndLoginUser('edit-fake', 'editfake', 'password123');
  
  const fakeId = new mongoose.Types.ObjectId();

  const response = await agent
    .post('/questions/edit/update')
    .send({
      questionId: fakeId.toString(),
      question: 'Test question',
      categori: ['Technical'],
      answer: 'Test answer'
    });

  expect(response.status).toBe(500);
});
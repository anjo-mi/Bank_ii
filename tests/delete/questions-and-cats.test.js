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

test('Owner can successfully delete their question', async () => {
  const { user, agent } = await createAndLoginUser('delete-success', 'deletesuccess', 'password123');
  
  const question = await Question.create({
    content: `Question to delete ${Date.now()}`,
    categories: ['Technical'],
    answer: 'Test answer',
    userId: user._id,
    isDefault: false
  });

  const response = await agent.delete(`/questions/delete/${question._id}`);

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('question has been removed from the database');
  
  // Verify question was actually deleted
  const deletedQuestion = await Question.findById(question._id);
  expect(deletedQuestion).toBeNull();
});

test('Deleting question removes orphaned user category', async () => {
  const { user, agent } = await createAndLoginUser('delete-orphan', 'deleteorphan', 'password123');
  
  // Create a unique category for this user
  const uniqueCategory = `UniqueCategory${Date.now()}`;
  await Category.create({
    description: uniqueCategory,
    userId: user._id,
    isDefault: false
  });
  
  // Create question with that category
  const question = await Question.create({
    content: `Only question with unique category ${Date.now()}`,
    categories: [uniqueCategory],
    userId: user._id,
    isDefault: false
  });

  const response = await agent.delete(`/questions/delete/${question._id}`);

  expect(response.status).toBe(200);
  
  // Verify category was deleted
  const orphanedCategory = await Category.findOne({ 
    description: uniqueCategory, 
    userId: user._id 
  });
  expect(orphanedCategory).toBeNull();
});

test('Deleting question does NOT remove category still used by other questions', async () => {
  const { user, agent } = await createAndLoginUser('delete-keep-cat', 'deletekeepcat', 'password123');
  
  const sharedCategory = `SharedCategory${Date.now()}`;
  await Category.create({
    description: sharedCategory,
    userId: user._id,
    isDefault: false
  });
  
  // Create two questions with the same category
  const question1 = await Question.create({
    content: `First question ${Date.now()}`,
    categories: [sharedCategory],
    userId: user._id,
    isDefault: false
  });
  
  const question2 = await Question.create({
    content: `Second question ${Date.now()}`,
    categories: [sharedCategory],
    userId: user._id,
    isDefault: false
  });

  // Delete only first question
  const response = await agent.delete(`/questions/delete/${question1._id}`);

  expect(response.status).toBe(200);
  
  // Verify category still exists
  const remainingCategory = await Category.findOne({ 
    description: sharedCategory, 
    userId: user._id 
  });
  expect(remainingCategory).toBeTruthy();
  
  // Verify second question still exists
  const remainingQuestion = await Question.findById(question2._id);
  expect(remainingQuestion).toBeTruthy();
});

test('Non-owner cannot delete question (403)', async () => {
  const timestamp = Date.now();
  
  // Create owner and their question
  const owner = await User.create({
    email: `owner-${timestamp}@email.com`,
    username: `owner${timestamp}`,
    password: 'password123'
  });
  
  const question = await Question.create({
    content: `Owner's question ${timestamp}`,
    categories: ['Technical'],
    userId: owner._id,
    isDefault: false
  });

  // Different user tries to delete
  const { agent } = await createAndLoginUser('delete-attacker', 'deleteattacker', 'password123');

  const response = await agent.delete(`/questions/delete/${question._id}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe('tsk tsk, this is not yours to remove');
  
  // Verify question was NOT deleted
  const unchangedQuestion = await Question.findById(question._id);
  expect(unchangedQuestion).toBeTruthy();
  expect(unchangedQuestion.content).toBe(`Owner's question ${timestamp}`);
});

test('Delete fails when question does not exist (500)', async () => {
  const { agent } = await createAndLoginUser('delete-notfound', 'deletenotfound', 'password123');
  
  const fakeId = new mongoose.Types.ObjectId();

  const response = await agent.delete(`/questions/delete/${fakeId}`);

  expect(response.status).toBe(500);
  expect(response.body.message).toBe('failed to locate question');
});

test('Delete does not remove categories belonging to other users', async () => {
  const timestamp = Date.now();
  const sharedCategoryName = `SharedByUsers${timestamp}`;
  
  // User A creates a category and question
  const userA = await User.create({
    email: `usera-${timestamp}@email.com`,
    username: `usera${timestamp}`,
    password: 'password123'
  });
  
  await Category.create({
    description: sharedCategoryName,
    userId: userA._id,
    isDefault: false
  });
  
  const questionA = await Question.create({
    content: `User A question ${timestamp}`,
    categories: [sharedCategoryName],
    userId: userA._id,
    isDefault: false
  });
  
  // User B creates their own version of the same category name and question
  const { user: userB, agent } = await createAndLoginUser('userb-delete', 'userbdelete', 'password123');
  
  await Category.create({
    description: sharedCategoryName,
    userId: userB._id,
    isDefault: false
  });
  
  const questionB = await Question.create({
    content: `User B question ${timestamp}`,
    categories: [sharedCategoryName],
    userId: userB._id,
    isDefault: false
  });
  
  // User B deletes their question
  const response = await agent.delete(`/questions/delete/${questionB._id}`);
  
  expect(response.status).toBe(200);
  
  // Verify User A's category still exists
  const userACategory = await Category.findOne({
    description: sharedCategoryName,
    userId: userA._id
  });
  expect(userACategory).toBeTruthy();
  
  // Verify User B's category was deleted (orphaned)
  const userBCategory = await Category.findOne({
    description: sharedCategoryName,
    userId: userB._id
  });
  expect(userBCategory).toBeNull();
});

test('Deleting question with multiple categories only removes orphaned ones', async () => {
  const { user, agent } = await createAndLoginUser('delete-multi-cat', 'deletemulticat', 'password123');
  
  const orphanCategory = `OrphanCat${Date.now()}`;
  const sharedCategory = `SharedCat${Date.now()}`;
  
  await Category.create({
    description: orphanCategory,
    userId: user._id,
    isDefault: false
  });
  
  await Category.create({
    description: sharedCategory,
    userId: user._id,
    isDefault: false
  });
  
  // Question 1 has both categories
  const question1 = await Question.create({
    content: `Question with both ${Date.now()}`,
    categories: [orphanCategory, sharedCategory],
    userId: user._id,
    isDefault: false
  });
  
  // Question 2 only has shared category
  const question2 = await Question.create({
    content: `Question with shared ${Date.now()}`,
    categories: [sharedCategory],
    userId: user._id,
    isDefault: false
  });
  
  // Delete question 1
  const response = await agent.delete(`/questions/delete/${question1._id}`);
  
  expect(response.status).toBe(200);
  
  // Orphan category should be deleted
  const deletedOrphan = await Category.findOne({
    description: orphanCategory,
    userId: user._id
  });
  expect(deletedOrphan).toBeNull();
  
  // Shared category should still exist
  const remainingShared = await Category.findOne({
    description: sharedCategory,
    userId: user._id
  });
  expect(remainingShared).toBeTruthy();
});
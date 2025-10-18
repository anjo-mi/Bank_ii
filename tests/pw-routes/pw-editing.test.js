import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';
import models from '../../models/index.js';
const { Question, User } = models;
import dotenv from 'dotenv';
dotenv.config();

test.beforeAll(async () => {
  await mongoose.connect(process.env.DB_TEST_STR);
  
  // Drop and rebuild indexes
  await User.collection.dropIndexes();
  await Question.collection.dropIndexes();
  await User.syncIndexes();
  await Question.syncIndexes();
});

test.afterAll(async () => {
  await mongoose.connection.close();
});

test.beforeEach(async () => {
  await mongoose.connection.close();
  await mongoose.connect(process.env.DB_TEST_STR);
  await User.deleteMany({});
  await Question.deleteMany({});
});

async function loginUser(page, email, password) {
  await page.goto('http://localhost:3000/auth');
  await page.fill('input[name="provided"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('input[id="submit"]');
  await page.waitForNavigation();
}

test('User can successfully update a question through full flow', async ({ page }) => {
  const i = Date.now();
  const user = await User.create({
    email: `pw-update${i}-flow@test.com`,
    username: `pwupdate${i}flow`,
    password: 'testpass123'
  });
  
  await Question.create({
    content: 'Original playwright question',
    categories: ['Technical'],
    answer: 'Original answer',
    userId: user._id,
    isDefault: false
  });

  await loginUser(page, user.email, 'testpass123');
  
  await page.goto('http://localhost:3000/questions/edit/select');
  await expect(page).toHaveURL('http://localhost:3000/questions/edit/select');
  
  await page.click('input[type="submit"][value="Edit"]');
  await page.waitForURL('http://localhost:3000/questions/edit');
  
  const questionTextarea = page.locator('textarea[name="question"]');
  await expect(questionTextarea).toHaveValue('Original playwright question');
  
  await questionTextarea.fill('Updated playwright question');
  await page.fill('textarea[name="answer"]', 'Updated answer');
  
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3000/questions/edit/select');
  
  await expect(page.locator('text=Updated playwright question')).toBeVisible();
});

// need to implement front end logic for this
// test('User can update categories through UI', async ({ page }) => {
//   const user = await User.create({
//     email: 'pw-categories@test.com',
//     username: 'pwcategories',
//     password: 'testpass123'
//   });
  
//   await Question.create({
//     content: 'Category test question',
//     categories: ['Technical'],
//     answer: 'Test answer',
//     userId: user._id,
//     isDefault: false
//   });

//   await loginUser(page, 'pw-categories@test.com', 'testpass123');
//   await page.goto('http://localhost:3000/questions/edit/select');
//   await page.click('input[type="submit"][value="Edit"]');
//   await page.waitForURL('http://localhost:3000/questions/edit');
  
//   const technicalCheckbox = page.locator('input[value="Technical"]');
//   if (await technicalCheckbox.isChecked()) {
//     await technicalCheckbox.uncheck();
//   }
  
//   await page.check('label:has-text("Behavioral")');
  
//   await page.click('button[type="submit"]');
//   await page.waitForURL('http://localhost:3000/questions/edit/select');
// });

test('User with no questions is redirected to create form', async ({ page }) => {
  const i = Date.now();
  const user = await User.create({
    email: `pw-noque${i}stions@test.com`,
    username: `pwnoque${i}stions`,
    password: 'testpass123'
  });

  await loginUser(page, user.email, 'testpass123');
  
  await page.goto('http://localhost:3000/questions/edit/select');
  await page.waitForURL('http://localhost:3000/questions/form');
});

test('Validation error displays when submitting empty question', async ({ page }) => {
  const i = Date.now();
  const user = await User.create({
    email: `pw-validati${i}on@test.com`,
    username: `pwva${i}lidation`,
    password: 'testpass123'
  });
  
  await Question.create({
    content: 'Test question',
    categories: ['Technical'],
    answer: 'Test answer',
    userId: user._id,
    isDefault: false
  });

  await loginUser(page, user.email, 'testpass123');
  await page.goto('http://localhost:3000/questions/edit/select');
  await page.click('input[type="submit"][value="Edit"]');
  await page.waitForURL('http://localhost:3000/questions/edit');
  
  await page.fill('textarea[name="question"]', '');
  
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('http://localhost:3000/questions/edit');
});

test('User can remove answer by clearing field', async ({ page }) => {
  const i = Date.now();
  const user = await User.create({
    email: `pw-removean${i}swer@test.com`,
    username: `pwre${i}moveanswer`,
    password: 'testpass123'
  });
  
  const question = await Question.create({
    content: 'Question with answer',
    categories: ['Behavioral'],
    answer: 'Original answer to remove',
    userId: user._id,
    isDefault: false
  });

  await loginUser(page, user.email, 'testpass123');
  await page.goto('http://localhost:3000/questions/edit/select');
  await page.click('input[type="submit"][value="Edit"]');
  await page.waitForURL('http://localhost:3000/questions/edit');
  
  await expect(page.locator('textarea[name="answer"]')).toHaveValue('Original answer to remove');
  
  await page.fill('textarea[name="answer"]', '');
  
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3000/questions/edit/select');
  
  const updatedQuestion = await Question.findById(question._id);
  expect(updatedQuestion.answer).toBe(null);
});
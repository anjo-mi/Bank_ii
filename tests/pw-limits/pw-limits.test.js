// @ts-check
import { test, expect } from "@playwright/test";

test('rate limit blocks after 7 login attempts', async ({ page }) => {
  for (let i = 0; i < 7; i++) {
    await page.goto('http://localhost:3000/auth');
    await page.fill('[name="provided"]', 'jibberish');
    await page.fill('[name="password"]', 'idontcare if this is right');
    await page.click('input[value="Log In"]');
  }
  
  await page.goto('http://localhost:3000/auth');
  await page.fill('[name="provided"]', 'jibberish');
  await page.fill('[name="password"]', 'idontcare if this is right');
  await page.click('input[value="Log In"]');
  
  await expect(page.locator('#error-message')).toContainText("for real? username OR email... wait 15 minutes for another few guesses");
});

test('first attempt will block after previous test quite failed 7', async ({ page }) => {
  for (let i = 0; i < 7; i++) {
    await page.goto('http://localhost:3000/auth');
    await page.fill('[name="provided"]', 'jibberish');
    await page.fill('[name="password"]', 'idontcare if this is right');
    await page.click('input[value="Log In"]');
  }
  
  await page.goto('http://localhost:3000/auth');
  await page.fill('[name="provided"]', 'jibberish');
  await page.fill('[name="password"]', 'idontcare if this is right');
  await page.click('input[value="Log In"]');
  
  await expect(page.locator('#error-message')).toContainText("for real? username OR email... wait 15 minutes for another few guesses");
});

test('different username and/or password still wont attempt', async ({ page }) => {
  for (let i = 0; i < 7; i++) {
    await page.goto('http://localhost:3000/auth');
    await page.fill('[name="provided"]', 'jibberish');
    await page.fill('[name="password"]', 'idontcare if this is right');
    await page.click('input[value="Log In"]');
  }
  
  await page.goto('http://localhost:3000/auth');
  await page.fill('[name="provided"]', 'butwhatifimsomeoneelse');
  await page.fill('[name="password"]', 'this*is&a%premier#password');
  await page.click('input[value="Log In"]');
  
  await expect(page.locator('#error-message')).toContainText("for real? username OR email... wait 15 minutes for another few guesses");
});

test('valid username and password still wont attempt', async ({ page }) => {
  for (let i = 0; i < 7; i++) {
    await page.goto('http://localhost:3000/auth');
    await page.fill('[name="provided"]', 'jibberish');
    await page.fill('[name="password"]', 'idontcare if this is right');
    await page.click('input[value="Log In"]');
  }
  
  await page.goto('http://localhost:3000/auth');
  await page.fill('[name="provided"]', 'master');
  await page.fill('[name="password"]', 'masterful');
  await page.click('input[value="Log In"]');
  
  await expect(page.locator('#error-message')).toContainText("for real? username OR email... wait 15 minutes for another few guesses");
});
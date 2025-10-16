// @ts-check
import { test, expect } from "@playwright/test";

test("one category, valid question, should work stay on same page\n doesnt show message yet", async ({
  page,
}) => {
 
  const i = Date.now();
  const e = `thisshouldwork${i}@gmail.com`;
  const u = `avaliduser${i}`;
  const p = `solidpassword`;

  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/auth/signup");
  
  await page.fill('input[name="email"]', e);
  await page.fill('input[name="username"]', u);
  await page.fill('input[name="password"]', p);
  await page.fill('input[name="confirm-password"]', p);
  await page.click("input[value='Create Account']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await expect(page).toHaveURL("http://localhost:3000/practice");
  
  await page.goto("http://localhost:3000/questions/form");
  
  await page.fill('textarea[id="question"]', 'what should i ask?');
  await page.click('label[for="CSS"]');
  await page.click("text='Create Question'");

  await expect(page).toHaveURL("http://localhost:3000/questions/form");
});

test("no category, valid question, should show error-message", async ({
  page,
}) => {
 
  const i = Date.now();
  const e = `thisshouldwork${i}@gmail.com`;
  const u = `avaliduser${i}`;
  const p = `solidpassword`;

  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/auth/signup");
  
  await page.fill('input[name="email"]', e);
  await page.fill('input[name="username"]', u);
  await page.fill('input[name="password"]', p);
  await page.fill('input[name="confirm-password"]', p);
  await page.click("input[value='Create Account']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await expect(page).toHaveURL("http://localhost:3000/practice");
  
  await page.goto("http://localhost:3000/questions/form");
  
  await page.fill('textarea[id="question"]', 'how do i do this?');
  await page.click("text='Create Question'");

  await expect(page).toHaveURL("http://localhost:3000/questions/form");
  await expect(page.locator("#error-message")).toHaveText('questions each need at least 1 category');
});

test("valid category, whitespace question, should stay on page (blocked by HTML required attribute", async ({
  page,
}) => {
 
  const i = Date.now();
  const e = `thisshouldwork${i}@gmail.com`;
  const u = `avaliduser${i}`;
  const p = `solidpassword`;

  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/auth/signup");
  
  await page.fill('input[name="email"]', e);
  await page.fill('input[name="username"]', u);
  await page.fill('input[name="password"]', p);
  await page.fill('input[name="confirm-password"]', p);
  await page.click("input[value='Create Account']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await expect(page).toHaveURL("http://localhost:3000/practice");
  
  await page.goto("http://localhost:3000/questions/form");
  
  await page.fill('textarea[id="question"]', '\n\n\n\n\n     \n\n\n \n');
  await page.click('label[for="CSS"]');
  await page.click("text='Create Question'");

  await expect(page).toHaveURL("http://localhost:3000/questions/form");
});
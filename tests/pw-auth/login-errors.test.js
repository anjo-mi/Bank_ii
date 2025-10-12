// @ts-check
import { test, expect } from "@playwright/test";

test("this should theoretically work all 3 calls, but only register one user and stay on register for the others", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/auth/signup");
  
  await page.fill('input[name="email"]', 'un@seen.org');
  await page.fill('input[name="username"]', 'opensource');
  await page.fill('input[name="password"]', 'solidpassword');
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[value='Create Account']");

});


test("incorrect username, valid password should be invalid", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  
  await page.fill('input[name="provided"]', 'opencourts');
  await page.fill('input[name="password"]', 'solidpassword');
  
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await expect(page.locator("#error-message")).toHaveText('invalid credentials');
  
  await expect(page).toHaveURL("http://localhost:3000/auth");

});

test("incorrect email, valid password should be invalid", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  
  await page.fill('input[name="provided"]', 'uni@seen.org');
  await page.fill('input[name="password"]', 'solidpassword');
  
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await expect(page.locator("#error-message")).toHaveText('invalid credentials');
  
  await expect(page).toHaveURL("http://localhost:3000/auth");

});

test("valid email, invalid password should be invalid", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  
  await page.fill('input[name="provided"]', 'un@seen.org');
  await page.fill('input[name="password"]', 'solipassword');
  
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await expect(page.locator("#error-message")).toHaveText('invalid password');
  
  await expect(page).toHaveURL("http://localhost:3000/auth");

});

test("valid username, invalid password should be invalid", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  
  await page.fill('input[name="provided"]', 'opensource');
  await page.fill('input[name="password"]', 'solipassword');
  
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await expect(page.locator("#error-message")).toHaveText('invalid password');
  
  await expect(page).toHaveURL("http://localhost:3000/auth");

});
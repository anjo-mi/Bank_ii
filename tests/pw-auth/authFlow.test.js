// @ts-check
import { test, expect } from "@playwright/test";

test("valid SIGN UP should send you to the practice page", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/signup");
  
  await page.fill('input[name="email"]', 'thisshouldwork@gmail.com');
  await page.fill('input[name="username"]', 'avaliduser');
  await page.fill('input[name="password"]', 'solidpassword');
  await page.click("input[type='submit']");
  
  await expect(page).toHaveURL("http://localhost:3000/practice");

});

test("valid LOG IN should send you to the practice page", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.click("text=Log In");
  
  await expect(page).toHaveURL("http://localhost:3000/login");
  
  await page.fill('input[name="email"]', 'thisshouldwork@gmail.com');
  await page.fill('input[name="username"]', 'avaliduser');
  await page.fill('input[name="password"]', 'solidpassword');
  await page.click("input[type='submit']");
  
  await expect(page).toHaveURL("http://localhost:3000/practice");

});

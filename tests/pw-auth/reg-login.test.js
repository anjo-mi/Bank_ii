// @ts-check
import { test, expect } from "@playwright/test";

const users = {
  one: {
    email: "demo@example.com",
    username: "deputyDog",
    password: "password123",
  },
  two: {
    email: "sarah.dev@example.com",
    username: "sarahcodes",
    password: "devlife2024",
  },
  three: {
    email: "mike.interview@example.com",
    username: "mikeprep",
    password: "interviews",
  },
  four: {
    email: "live@theapollo.com",
    username: "arsenio",
    password: "hallmark",
  },
}

test.beforeEach(async () => {
  await fetch('http://localhost:3000/test/clearLimits', {method: 'POST'});
})

test("valid SIGN UP then login w/ EMAIL should take you to practice page", async ({
  page,
}) => {
  
  const i = Date.now();
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  await page.click("text=Sign Up");
  
  await page.waitForURL("http://localhost:3000/auth/signup");
  
  await page.fill('input[name="email"]', `thisshouldwork${i}@gmail.com`);
  await page.fill('input[name="username"]', `avaliduser${i}`);
  await page.fill('input[name="password"]', `solidpassword`);
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[value='Create Account']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/auth");
  await page.fill('input[name="provided"]', `thisshouldwork${i}@gmail.com`);
  await page.fill('input[name="password"]', `solidpassword`);
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/practice");
  
});

test("valid SIGN UP then login w/ USERNAME should take you to practice page", async ({
  page,
}) => {
  
  const i = Math.floor(Math.random() * 9999999999999);
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  await page.click("text=Sign Up");
  
  await page.waitForURL("http://localhost:3000/auth/signup");
  
  await page.fill('input[name="email"]', `thisshouldwork${i}@gmail.com`);
  await page.fill('input[name="username"]', `avaliduser${i}`);
  await page.fill('input[name="password"]', `solidpassword`);
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[value='Create Account']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/auth");
  await page.fill('input[name="provided"]', `avaliduser${i}`);
  await page.fill('input[name="password"]', `solidpassword`);
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/practice");
  
});

test("invalid USERNAME should send you back to /auth", async ({
  page,
}) => {
  
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  
  await page.waitForURL("http://localhost:3000/auth");
  await page.fill('input[name="provided"]', `alias`);
  await page.fill('input[name="password"]', `solidpassword`);
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/auth");
  
});

test("invalid EMAIL should send you back to /auth", async ({
  page,
}) => {
  
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  
  await page.waitForURL("http://localhost:3000/auth");
  await page.fill('input[name="provided"]', `thisis@test.com`);
  await page.fill('input[name="password"]', `solidpassword`);
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/auth");
  
});

test("valid EMAIL, invalid password should send you back to /auth", async ({
  page,
}) => {
  
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  
  await page.waitForURL("http://localhost:3000/auth");
  await page.fill('input[name="provided"]', users.one.email);
  await page.fill('input[name="password"]', `abrokenpassword`);
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/auth");
  
});

test("valid USERNAME, invalid password should send you back to /auth", async ({
  page,
}) => {
  
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  
  await page.waitForURL("http://localhost:3000/auth");
  await page.fill('input[name="provided"]', users.one.username);
  await page.fill('input[name="password"]', `abrokenpassword`);
  await page.click("input[value='Log In']");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/auth");
  
});

test("valid login followed by logout should not be able to access /practice", async ({
  page,
}) => {
  
  const i = Date.now();
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Log In");
  await page.click("text=Sign Up");
  
  await page.waitForURL("http://localhost:3000/auth/signup");
  
  await page.fill('input[name="email"]', `thisshouldwork${i}@gmail.com`);
  await page.fill('input[name="username"]', `avaliduser${i}`);
  await page.fill('input[name="password"]', `solidpassword`);
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[value='Create Account']");
  
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/auth");
  await page.fill('input[name="provided"]', `thisshouldwork${i}@gmail.com`);
  await page.fill('input[name="password"]', `solidpassword`);
  await page.click("input[value='Log In']");
  
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.waitForURL("http://localhost:3000/practice");
  await page.click("text=Log Out");
  
  await page.waitForURL("http://localhost:3000/");
  await page.click("text=Practice");
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  await page.waitForURL("http://localhost:3000/auth");
});

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
}


test("valid SIGN UP should send you to the practice page", async ({
  page,
}) => {
 
  const i = Date.now();
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/auth");
  
  await page.fill('input[name="email"]', `thisshouldwork${i}@gmail.com`);
  await page.fill('input[name="username"]', `avaliduser${i}`);
  await page.fill('input[name="password"]', `solidpassword`);
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[type='submit']");
  
  await expect(page).toHaveURL("http://localhost:3000/practice");
  
});

test("duplicate EMAIL should alert you of such", async ({
  page,
}) => {
  const i = Date.now();
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/auth");
  
  await page.fill('input[name="email"]', `thesame${i}@email.com`);
  await page.fill('input[name="username"]', `anaviduser${i}`);
  await page.fill('input[name="password"]', 'solidpassword');
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[type='submit']");
  await expect(page).toHaveURL("http://localhost:3000/practice");
  await page.click("text=Sign Up");

  await page.fill('input[name="email"]', `thesame${i}@email.com`);
  await page.fill('input[name="username"]', `notthesameuser${i}`);
  await page.fill('input[name="password"]', 'solidpassword');
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[type='submit']");
  
  await expect(page.locator("#error-message")).toHaveText('Email already Registered');
  
  await expect(page).toHaveURL("http://localhost:3000/auth");

});

test("duplicate USERNAME should alert you of such", async ({
  page,
}) => {
  const i = Date.now();
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/auth");
  
  await page.fill('input[name="email"]', `completely${i}@original.org`);
  await page.fill('input[name="username"]', `boundtobecopied${i}`);
  await page.fill('input[name="password"]', 'solidpassword');
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[type='submit']");
  await expect(page).toHaveURL("http://localhost:3000/practice");
  await page.click("text=Sign Up");

  await page.fill('input[name="username"]', `boundtobecopied${i}`);
  await page.fill('input[name="email"]', `alsocompletely${i}@original.org`);
  await page.fill('input[name="password"]', 'solidpassword');
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[type='submit']");
  
  await expect(page.locator("#error-message")).toHaveText('Username is already Taken');
  
  await expect(page).toHaveURL("http://localhost:3000/auth");

});

test("invalid characters in the EMAIL should show", async ({
  page,
}) => {
  
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/auth");
  
  await page.fill('input[name="email"]', 'un@seen.org');
  await page.fill('input[name="username"]', 'open()source');
  await page.fill('input[name="password"]', 'solidpassword');
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[type='submit']");
  
  await expect(page.locator("#error-message")).toHaveText('Your username may only contain alpha-numeric characters or ,./+=-!@#$%^&*_, but no whitespace');
  
  await expect(page).toHaveURL("http://localhost:3000/auth");

});

test("invalid characters in the USERNAME should show", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Sign Up");
  
  await expect(page).toHaveURL("http://localhost:3000/auth");
  
  await page.fill('input[name="email"]', 'un@seen.org');
  await page.fill('input[name="username"]', 'open()source');
  await page.fill('input[name="password"]', 'solidpassword');
  await page.fill('input[name="confirm-password"]', 'solidpassword');
  await page.click("input[type='submit']");
  
  await expect(page.locator("#error-message")).toHaveText('Your username may only contain alpha-numeric characters or ,./+=-!@#$%^&*_, but no whitespace');
  
  await expect(page).toHaveURL("http://localhost:3000/auth");

});



// test("valid LOG IN should send you to the practice page", async ({
//   page,
// }) => {
//   await page.goto("http://localhost:3000/");

//   await page.click("text=Log In");
  
//   await expect(page).toHaveURL("http://localhost:3000/login");
  
//   await page.fill('input[name="email"]', 'thisshouldwork@gmail.com');
//   await page.fill('input[name="username"]', 'avaliduser');
//   await page.fill('input[name="password"]', 'solidpassword');
//   await page.click("input[type='submit']");
  
//   await expect(page).toHaveURL("http://localhost:3000/practice");

// });


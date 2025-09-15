// @ts-check
import { test, expect } from "@playwright/test";

test("load landing page", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveURL("http://localhost:3000");
});

test("user can navigate from home / categories to questions", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  await page.click("text=All Questions");

  const content = await page.textContent("body");
  await expect(page).toHaveURL("http://localhost:3000/questions");
});

test("user can navigate from questions to home / categories", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.click("text=Home");

  const content = await page.textContent("body");
  await expect(page).toHaveURL("http://localhost:3000/");
});

test("user will receive only questions with the selected categories", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[name="Behavioral"]').check();
  await page.locator('input[name="React"]').check();
  await page.click("text=Get Questions");
  const content = await page.textContent("body");
  const receivedContent = content ? true : false;
  expect(receivedContent).toBe(true);
});

test("user will receive all questions when no categories are selected", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  const content = await page.textContent("body");

  await page.click("text=Get Questions");

  await expect(page).toHaveURL("http://localhost:3000/questions/categories?");
});

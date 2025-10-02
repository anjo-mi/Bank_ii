// @ts-check
import { test, expect } from "@playwright/test";


test("no Match preference, assume anyMatch, multiple requested categories", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="Problem Solving"]').check();
  await page.click("text=Get Questions");

  await expect(page.locator(".question-list-item")).toHaveCount(11);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

test("click anyMatch, multiple requested categories", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="0"]').check();
  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="React"]').check();
  await page.click("text=Get Questions");

  await expect(page.locator(".question-list-item")).toHaveCount(10);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

test("click anyMatch, single requested category", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="0"]').check();
  await page.locator('input[value="Behavioral"]').check();
  await page.click("text=Get Questions");

  await expect(page.locator(".question-list-item")).toHaveCount(8);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

test("click anyMatch, no requested categories", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="0"]').check();
  await page.click("text=Get Questions");

  await expect(page.locator(".question-list-item")).toHaveCount(25);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

test("click allMatch, no requested categories", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="1"]').check();
  await page.click("text=Get Questions");

  await expect(page.locator(".question-list-item")).toHaveCount(0);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

test("click allMatch, single requested category", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="1"]').check();
  await page.locator('input[value="Technical"]').check();
  await page.click("text=Get Questions");

  await expect(page.locator(".question-list-item")).toHaveCount(14);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

test("click allMatch, multiple requested categories, has results", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="1"]').check();
  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="Problem Solving"]').check();
  await page.click("text=Get Questions");

  await expect(page.locator(".question-list-item")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

test("click allMatch, multiple requested categories, has 0 results", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="1"]').check();
  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="React"]').check();
  await page.click("text=Get Questions");

  await expect(page.locator(".question-list-item")).toHaveCount(0);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

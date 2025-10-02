// @ts-check
import { test, expect } from "@playwright/test";


test("1 category, 1 search item", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.fill('input[name="search"]', 'time');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("text=Clear Keyword Search");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
});

test("1 search item, no categories, clearing search should show all questions", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.fill('input[name="search"]', 'time');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("text=Clear Keyword Search");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
});

test("2 categories, broad search that get cleared, clear All filters", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="Problem Solving"]').check();
  await page.fill('input[name="search"]', 'g');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(8);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("text=Clear Keyword Search");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(11);
  await page.click("a[href='/questions']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(25);
  await expect(page).toHaveURL("http://localhost:3000/questions");
});


test("match ALL, 1 search, 1 category, clear, clear all", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  
  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="1"]').check();
  await page.fill('input[name="search"]', 'tell');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("text=Clear Keyword Search");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(8);
  await page.click("a[href='/questions']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(25);
  await expect(page).toHaveURL("http://localhost:3000/questions");
});


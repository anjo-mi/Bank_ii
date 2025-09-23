// @ts-check
import { test, expect } from "@playwright/test";


test("single search works", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.fill('input[name="search"]', 'time');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

test("input being part of a word should yield match", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="Problem Solving"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(11);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.fill('input[name="search"]', 'g');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(8);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});

test("first search yields 4 results, second search is unaffected by duplicate words", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="Problem Solving"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(11);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.fill('input[name="search"]', 'your');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(4);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  await page.fill('input[name="search"]', 'your your');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(4);
});

test("second search should not be affected by the first", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="Problem Solving"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(11);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.fill('input[name="search"]', 'your');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(4);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  await page.fill('input[name="search"]', 'tell');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
});


test("should be case insensitive", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.fill('input[name="search"]', 'tell');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});


test("trimmed empty search should filter no results", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.fill('input[name="search"]', '   ');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});


test("no match should yield no results", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.fill('input[name="search"]', 'z');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(0);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});



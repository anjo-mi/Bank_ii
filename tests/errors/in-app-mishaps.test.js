// @ts-check
import { test, expect } from "@playwright/test";


test("a 'no-results' search from /questions should result in a no-show box now showing a box", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.fill('input[name="search"]', 'time');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await page.fill('input[name="search"]', 'appeared');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(0);
  await expect(page.locator(".no-results-box:visible")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
});

test("clicking all questions should clear all of the filters", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.fill('input[name="search"]', 'time');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await page.fill('input[name="search"]', 'appeared');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(0);
  await expect(page.locator(".no-results-box:visible")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("a[href='/questions']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(25);
  await expect(page).toHaveURL("http://localhost:3000/questions");
});

test("clearing the search parameters should return prior results", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.fill('input[name="search"]', 'time');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await page.fill('input[name="search"]', 'appeared');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(0);
  await expect(page.locator(".no-results-box:visible")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("button[id='clear-btn']");
  await page.waitForSelector(".no-results-box", { state: 'hidden' });
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
  await expect(page.locator(".no-results-box:visible")).toHaveCount(0);
});

test("too specific from /index should show box immediately", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.locator('input[value="1"]').check();
  await page.fill('input[name="search"]', 'appeared');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(0);
  await expect(page.locator(".no-results-box:visible")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
});

test("too specific from /index should show results after clearing search params", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.locator('input[value="1"]').check();
  await page.fill('input[name="search"]', 'appeared');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(0);
  await expect(page.locator(".no-results-box:visible")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("button[id='clear-btn']");
  await page.waitForSelector(".no-results-box", { state: 'hidden' });
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
  await expect(page.locator(".no-results-box:visible")).toHaveCount(0);
});



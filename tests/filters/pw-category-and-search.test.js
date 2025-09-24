// @ts-check
import { test, expect } from "@playwright/test";


test("match ANY, 1 search, 1 category", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Communication"]').check();
  await page.fill('input[name="search"]', 'time');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("a[href='/questions']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(25);
  await expect(page).toHaveURL("http://localhost:3000/questions");
});

test("match ANY, 2 search, 2 categories, multiple searches", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="Problem Solving"]').check();
  await page.fill('input[name="search"]', 'g for');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("a[href='/questions']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(25);
  await expect(page).toHaveURL("http://localhost:3000/questions");
});

test("match ANY, 2 Search, no categories", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.fill('input[name="search"]', 'a for');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("a[href='/']");
  await page.fill('input[name="search"]', 'a tell');
  await page.click("text=Get Questions");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  await page.fill('input[name="search"]', 'your your');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(5);
});

test("match ALL, 1 search, 1 category", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="1"]').check();
  await page.fill('input[name="search"]', 'tell');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("a[href='/questions']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(25);
  await expect(page).toHaveURL("http://localhost:3000/questions");
});


test("match ALL, 1 search, no categories, (should run matchAll on search params)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.fill('input[name="search"]', 'tell');
  await page.locator('input[value="1"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(3);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.click("a[href='/questions']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(25);
  await expect(page).toHaveURL("http://localhost:3000/questions");
});


test("match ALL, 2 searches, 1 category, AND empty searches dont affect results", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="1"]').check();
  await page.fill('input[name="search"]', 'about a');
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.fill('input[name="search"]', '   ');
  await page.click("button[id='search-btn']");
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});


test("basic category search should still work, ALL match", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="1"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(8);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});


test("basic category search should still work, ANY match", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator('input[value="React"]').check();
  await page.click("text=Get Questions");
  
  await expect(page.locator(".question-list-item:visible")).toHaveCount(2);
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
});


// @ts-check
import { test, expect } from "@playwright/test";


test("proper appearance for index, category request, then questions/byCategory; across devices", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator('.nav-bar')).toBeVisible();
  await expect(page.locator('.nav-item')).toHaveCount(4);
  
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator('.nav-bar')).toBeVisible();
  await expect(page.locator('.nav-item')).toHaveCount(4);
  
  await page.setViewportSize({ width: 1024, height: 600 });
  await expect(page.locator('.nav-bar')).toBeVisible();
  await expect(page.locator('.nav-item')).toHaveCount(4);
  
  await page.locator('input[value="Behavioral"]').check();
  await page.locator('input[value="Problem Solving"]').check();
  await page.click("text=Get Questions");

  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator('.nav-bar')).toBeVisible();
  await expect(page.locator('.nav-item')).toHaveCount(4);
  await expect(page.locator(".question-list-item")).toHaveCount(11);
  
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator('.nav-bar')).toBeVisible();
  await expect(page.locator('.nav-item')).toHaveCount(4);
  await expect(page.locator(".question-list-item")).toHaveCount(11);
  
  await page.setViewportSize({ width: 1024, height: 600 });
  await expect(page.locator('.nav-bar')).toBeVisible();
  await expect(page.locator('.nav-item')).toHaveCount(4);
  await expect(page.locator(".question-list-item")).toHaveCount(11);
  
});

test("index, no requested categories, /questions displays work across devices", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");
  
  await page.click("text=Get Questions");
  
  await expect(page).toHaveURL("http://localhost:3000/questions/byCategory");
  
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator('.nav-bar')).toBeVisible();
  await expect(page.locator('.nav-item')).toHaveCount(4);
  await expect(page.locator(".question-list-item")).toHaveCount(25);
  
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator('.nav-bar')).toBeVisible();
  await expect(page.locator('.nav-item')).toHaveCount(4);
  await expect(page.locator(".question-list-item")).toHaveCount(25);
  
  await page.setViewportSize({ width: 1024, height: 600 });
  await expect(page.locator('.nav-bar')).toBeVisible();
  await expect(page.locator('.nav-item')).toHaveCount(4);
  await expect(page.locator(".question-list-item")).toHaveCount(25);
});
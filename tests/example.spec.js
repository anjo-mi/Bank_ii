// @ts-check
import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

test('load landing page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page).toHaveURL('http://localhost:3000');
});

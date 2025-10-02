// @ts-check
import { test, expect } from "@playwright/test";

test("more questions asked for than had (2 categories selected):\nshould show proceedMessage\ntotal questions should equal questions length", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/practice");

  await page.fill('input[id="limit"]', '12');
  await page.locator('input[value="Communication"]').check();
  await page.locator('input[value="Node.js"]').check();
  await page.click("text=Begin Interview");
  
  await expect(page.locator("#proceedMessage")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/practice/start");
  
  await page.click("input[type='submit']");
  
  // should have 4 questions
  let x = 1;
  while (x <= 4){
    await expect(page).toHaveURL("http://localhost:3000/practice/next");
    const n = await page.locator("#questionNumber");
    await expect(n).toHaveText(x.toString());
    const t = await page.locator("#totalQuestions");
    await expect(t).toHaveText('4');
    await expect(page.locator(".question-content")).toHaveCount(1);
    x++;
    await page.click("input[value='End Response']");
  }
  
  await expect(page).toHaveURL("http://localhost:3000/practice/next");

  await expect(page.locator(".result-card")).toHaveCount(4);
  await expect(page.locator(".question-portion")).toHaveCount(4);
  await expect(page.locator(".answer-portion")).toHaveCount(4);
});


test("no categories selected, no limit set:\nshould show beginMessage\nshould default to 7 questions\nall questions should be available\nshould be able to proceed to end interview", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/practice");

  await page.click("text=Begin Interview");
  
  await expect(page.locator("#beginMessage")).toHaveCount(1);
  await expect(page).toHaveURL("http://localhost:3000/practice/start");
  
  await page.click("input[type='submit']");
  
  // should have 7 questions
  let x = 1;
  while (x <= 7){
    await expect(page).toHaveURL("http://localhost:3000/practice/next");
    const n = await page.locator("#questionNumber");
    await expect(n).toHaveText(x.toString());
    const t = await page.locator("#totalQuestions");
    await expect(t).toHaveText('7');
    await expect(page.locator(".question-content")).toHaveCount(1);
    x++;
    await page.click("input[value='End Response']");
  }
  
  await expect(page).toHaveURL("http://localhost:3000/practice/next");

  await expect(page.locator(".result-card")).toHaveCount(7);
  await expect(page.locator(".question-portion")).toHaveCount(7);
  await expect(page.locator(".answer-portion")).toHaveCount(7);
});


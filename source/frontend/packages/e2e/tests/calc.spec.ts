import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('{string} にアクセスする', async ({ page }, url) => {
  await page.goto(url);
});

When('「5・6」ボタンを押すと input それぞれに「5」「6」が表示される', async ({ page }) => {
  await page.getByRole('button', { name: 'fivesix' }).click();
  const input1 = await page.getByRole('spinbutton', { name: 'num1' });
  const input2 = await page.getByRole('spinbutton', { name: 'num2' });
  await expect(input1).toHaveValue('5');
  await expect(input2).toHaveValue('6');
});

When('計算ボタンを押す', async ({ page }) => {
  await page.getByRole('button', {name: "calc"}).click();
});

Then('{string} が表示される', async ({ page }, result) => {
  await expect(page.getByText(result)).toBeVisible();
});

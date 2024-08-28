import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('{string} にアクセスする', async ({ page }, url) => {
  await page.goto(url);
});

When('{string} と {string} を入力する', async ({ page }, num1, num2) => {
  await page.getByRole('spinbutton', { name: 'num1' }).fill(num1);
  await page.getByRole('spinbutton', { name: 'num2' }).fill(num2);
});

When('計算ボタンを押す', async ({ page }) => {
  await page.getByRole('button').click();
});

Then('{string} が表示される', async ({ page }, result) => {
  await expect(page.getByText(result)).toBeVisible();
});

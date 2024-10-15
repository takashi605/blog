import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('{string} にアクセスする', async ({ page }, url) => {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  await page.goto(`${process.env.TEST_TARGET_URL}${url}`);
});

Then('記事タイトル が表示される', async ({ page }) => {
  const title = page.locator('h1');

  await expect(title.textContent).not.toBe('');
});

Then('記事本文 が表示される', async ({ page }) => {
  const p = page.locator('p');

  const count = await p.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(p.nth(i).textContent).not.toBe('');
  }
});

Then('h2見出し が表示される', async ({ page }) => {
  const h2 = page.locator('h2');

  const count = await h2.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(h2.nth(i).textContent).not.toBe('');
  }
});

Then('h3見出し が表示される', async ({ page }) => {
  const h3 = page.locator('h3');

  const count = await h3.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(h3.nth(i).textContent).not.toBe('');
  }
});

Then('投稿日時 が表示される', async ({ page }) => {
  await expect(page.getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/)).toBeVisible();
});

Then('更新日時 が表示される', async ({ page }) => {
  await expect(page.getByText(/更新日:\d{4}\/\d{1,2}\/\d{1,2}/)).toBeVisible();
});

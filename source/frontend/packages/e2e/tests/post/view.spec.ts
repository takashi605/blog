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
  await expect(
    page.getByRole('heading', { level: 1, name: 'post-title' }),
  ).toBeVisible();
});

Then('記事本文 が表示される', async ({ page }) => {
  await expect(page.getByText('記事本文')).toBeVisible();
});

Then('h2見出し が表示される', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
});

Then('h3見出し が表示される', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 3 })).toBeVisible();
});

Then('投稿日時 が表示される', async ({ page }) => {
  await expect(page.getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/)).toBeVisible();
});

Then('更新日時 が表示される', async ({ page }) => {
  await expect(page.getByText(/更新日:\d{4}\/\d{1,2}\/\d{1,2}/)).toBeVisible();
});

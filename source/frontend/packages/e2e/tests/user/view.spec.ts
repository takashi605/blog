import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('正常な記事が取得できるページにアクセスする', async function ({ page }) {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }

  await page.goto(
    `${process.env.TEST_TARGET_URL}/posts/672f2772-72b5-404a-8895-b1fbbf310801`,
  );
});

Then('記事サムネイル が表示される', async function ({ page }) {
  const thumbnailImage = page.getByRole('img', { name: 'サムネイル画像' });
  await expect(thumbnailImage).toBeVisible({ timeout: 20000 });
});

Then('記事タイトル が表示される', async function ({ page }) {
  const title = page.locator('h1');

  expect(title.textContent).not.toBe('');
});

Then('記事本文 が表示される', async function ({ page }) {
  const p = page.locator('p');

  const count = await p.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    expect(p.nth(i).textContent).not.toBe('');
  }
});

Then('記事本文 に太字が含まれている', async function ({ page }) {
  const strong = page.locator('strong');

  const count = await strong.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    expect(strong.nth(i).textContent).not.toBe('');
  }
});

Then('h2見出し が表示される', async function ({ page }) {
  const h2 = page.locator('h2');

  const count = await h2.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    expect(h2.nth(i).textContent).not.toBe('');
  }
});

Then('h3見出し が表示される', async function ({ page }) {
  const h3 = page.locator('h3');

  const count = await h3.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(h3.nth(i).textContent).not.toBe('');
  }
});

Then('画像コンテンツ が表示される', async function ({ page }) {
  const contentImages = page.getByRole('img', { name: '画像コンテンツ' });
  const count = await contentImages.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(contentImages.nth(i)).toBeVisible({ timeout: 20000 });
  }
});

Then('投稿日時 が表示される', async function ({ page }) {
  await expect(page.getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/)).toBeVisible({
    timeout: 20000,
  });
});

Then('更新日時 が表示される', async function ({ page }) {
  await expect(page.getByText(/更新日:\d{4}\/\d{1,2}\/\d{1,2}/)).toBeVisible({
    timeout: 20000,
  });
});
Given(
  '対応する記事データが存在しないページにアクセスする',
  async function ({ page }) {
    if (!process.env.TEST_TARGET_URL) {
      throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
    }

    await page.goto(
      `${process.env.TEST_TARGET_URL}/posts/c9032cae-d7cd-4454-8ed9-5be8870f14b4`,
    );
  },
);

Then(
  'データ未存在により {string} というエラーメッセージが表示される',
  async function ({ page }, errorMessage) {
    await expect(page.getByText(errorMessage)).toBeVisible({
      timeout: 20000,
    });
  },
);

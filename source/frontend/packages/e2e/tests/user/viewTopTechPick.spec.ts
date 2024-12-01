import { Before, Given, Then } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import { chromium, expect } from '@playwright/test';

let page: Page;

Before(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
});

Given(
  'トップページにアクセスしてトップテックピック記事を閲覧する',
  async () => {
    if (!process.env.TEST_TARGET_URL) {
      throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
    }
    await page.goto(`${process.env.TEST_TARGET_URL}`);
  },
);

// TODO alt にサムネイル画像が含まれる画像はほかにもあるので、
// 「TOP TECH PICK!」のテキスト取得→その親要素のセクション要素を取得→そのセクション要素内にある img 要素を取得のようにとる
Then('トップテックピック記事のサムネイル画像が表示されている', async () => {
  const sectionTitle = page.getByText('TOP TECH PICK!');
  const section = page.locator('section', { has: sectionTitle });
  const thumbnailImage = section.getByRole('img', {
    name: 'サムネイル画像',
  });
  await expect(thumbnailImage).toBeVisible();
});
Then('トップテックピック記事の記事タイトルが表示されている', async () => {
  const title = page.locator('h1');

  expect(await title.textContent()).not.toBe('');
});
Then('トップテックピック記事の記事本文の抜粋が表示されている', async () => {
  const thumbnailImage = page.getByRole('img', {
    name: 'サムネイル画像',
  });
  const topTechPickSection = page.locator('section', {
    has: thumbnailImage,
  });
  const p = topTechPickSection.locator('p');

  expect(await p.textContent()).not.toBe('');
});

Then('トップテックピック記事の投稿日時が表示されている', async () => {
  const thumbnailImage = page.getByRole('img', {
    name: 'サムネイル画像',
  });
  const topTechPickSection = page.locator('section', {
    has: thumbnailImage,
  });

  await expect(
    topTechPickSection.getByText(/\d{4}\/\d{1,2}\/\d{1,2}/),
  ).toBeVisible();
});

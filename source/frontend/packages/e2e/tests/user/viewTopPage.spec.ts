import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given(
  'トップページにアクセスしてトップテックピック記事を閲覧する',
  async ({ page }) => {
    if (!process.env.TEST_TARGET_URL) {
      throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
    }
    await page.goto(`${process.env.TEST_TARGET_URL}`);
  },
);

Then(
  'トップテックピック記事のサムネイル画像が表示されている',
  async ({ page }) => {
    const thumbnailImage = page.getByRole('img', {
      name: 'サムネイル画像',
    });
    await expect(thumbnailImage).toBeVisible();
  },
);
Then(
  'トップテックピック記事の記事タイトルが表示されている',
  async ({ page }) => {
    const title = page.locator('h2');

    expect(await title.textContent()).not.toBe('');
  },
);
Then(
  'トップテックピック記事の記事本文の抜粋が表示されている',
  async ({ page }) => {
    const thumbnailImage = page.getByRole('img', {
      name: 'サムネイル画像',
    });
    const topTechPickSection = page.locator('section', {
      has: thumbnailImage,
    });
    const p = topTechPickSection.locator('p');

    expect(await p.textContent()).not.toBe('');
  },
);

Then('トップテックピック記事の投稿日時が表示されている', async ({ page }) => {
  const thumbnailImage = page.getByRole('img', {
    name: 'サムネイル画像',
  });
  const topTechPickSection = page.locator('section', {
    has: thumbnailImage,
  });

  await expect(topTechPickSection.getByText(/\d{4}\/\d{1,2}\/\d{1,2}/)).toBeVisible();
});

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { createBdd } from 'playwright-bdd';
const { Given, Then } = createBdd();

Given(
  'トップページにアクセスしてトップテックピック記事を閲覧する',
  async function ({page}) {
    if (!process.env.TEST_TARGET_URL) {
      throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
    }

    await page.goto(`${process.env.TEST_TARGET_URL}`);
  },
);

Then(
  'トップテックピック記事のサムネイル画像が表示されている',
  async function ({page}) {

    const topTechPickSection = getTopTechPickSection(page);
    const thumbnailImage = topTechPickSection.getByRole('img', {
      name: 'サムネイル画像',
    });
    await expect(thumbnailImage).toBeVisible({ timeout: 20000 });
  },
);

// TODO h1 タグであるのは適切でないため、修正が必要
// adobe blog は h3 だったので、そのように修正するといいかも
Then('トップテックピック記事の記事タイトルが表示されている', async function ({page}) {

  const title = page.locator('h1');

  expect(await title.textContent()).not.toBe('');
});
Then(
  'トップテックピック記事の記事本文の抜粋が表示されている',
  async function ({page}) {

    const topTechPickSection = getTopTechPickSection(page);
    const p = topTechPickSection.locator('p');

    expect(await p.textContent()).not.toBe('');
  },
);

Then('トップテックピック記事の投稿日時が表示されている', async function ({page}) {

  const topTechPickSection = getTopTechPickSection(page);

  await expect(
    topTechPickSection.getByText(/\d{4}\/\d{1,2}\/\d{1,2}/),
  ).toBeVisible({ timeout: 20000 });
});

function getTopTechPickSection(page: Page) {
  const sectionTitle = page.getByText('TOP TECH PICK!');
  return page.locator('section', { has: sectionTitle });
}

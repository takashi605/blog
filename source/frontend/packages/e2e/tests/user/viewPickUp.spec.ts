import { Given, Then } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

Given(
  'トップページにアクセスしてピックアップ記事を閲覧する',
  async function () {
    if (!process.env.TEST_TARGET_URL) {
      throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
    }
    const page = playwrightHelper.getPage();

    await page.goto(`${process.env.TEST_TARGET_URL}`);
  },
);
Then(
  '各ピックアップ記事のサムネイル画像が3件分表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const pickUpSection = getPickUpSection(page);
    const thumbnailImages = pickUpSection.locator('img');
    expect(await thumbnailImages.count()).toBe(3);
  },
);
Then(
  '各ピックアップ記事の記事タイトルが3件分表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const pickUpSection = getPickUpSection(page);
    const titles = pickUpSection.locator('h3');
    expect(await titles.count()).toBe(3);
  },
);

function getPickUpSection(page: Page) {
  const pickUpSectionTitle = page.locator('h2', { hasText: '注目記事' });
  return page.locator('section', { has: pickUpSectionTitle });
}

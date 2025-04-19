import { Given, Then } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

Given('トップページにアクセスして人気記事を閲覧する', async function () {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();

  await page.goto(`${process.env.TEST_TARGET_URL}`);
});
Then('各人気記事のサムネイル画像が3件分表示されている', async function () {
  const page = playwrightHelper.getPage();

  const popularSection = getPopularSection(page);
  const thumbnailImages = popularSection.locator('img');
  expect(await thumbnailImages.count()).toBe(3);
});
Then('各人気記事の記事タイトルが3件分表示されている', async function () {
  const page = playwrightHelper.getPage();

  const popularSection = getPopularSection(page);
  const titles = popularSection.locator('h3');
  expect(await titles.count()).toBe(3);
});

function getPopularSection(page: Page) {
  const popularSectionTitle = page.locator('h2', { hasText: '人気記事' });
  return page.locator('section', { has: popularSectionTitle });
}

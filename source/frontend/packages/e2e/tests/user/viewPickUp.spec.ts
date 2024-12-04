import { Before, Given, Then } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import { chromium, expect } from '@playwright/test';

let page: Page;

Before(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
});

Given('トップページにアクセスしてピックアップ記事を閲覧する', async () => {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  await page.goto(`${process.env.TEST_TARGET_URL}`);
});
Then('各ピックアップ記事のサムネイル画像が3件分表示されている', async() => {
  const pickUpSection = getPickUpSection(page);
  const thumbnailImages = pickUpSection.locator('img');
  expect(await thumbnailImages.count()).toBe(3);
});
Then('各ピックアップ記事の記事タイトルが3件分表示されている', async () => {
  const pickUpSection = getPickUpSection(page);
  const titles = pickUpSection.locator('h3');
  expect(await titles.count()).toBe(3);
});

function getPickUpSection(page: Page) {
  const pickUpSectionTitle = page.locator('h2', { hasText: 'PICK UP!!' });
  return page.locator('section', { has: pickUpSectionTitle });
}

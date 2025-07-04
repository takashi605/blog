import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

Given('【一覧表示】画像管理ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();

  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/blog/images') && resp.status() === 200,
    ),
    page.goto(`${process.env.ADMIN_URL}/images`),
  ]);

  // 画像一覧取得 API の fetch 完了を待つ
  expect(response.status()).toBe(200);
  await response.json();
});
Then('3件以上の画像が表示される', async function () {
  const page = playwrightHelper.getPage();

  const images = page.locator('img');
  expect(await images.count()).toBeGreaterThan(2);
});
Then('各画像のパスが表示される', async function () {
  const page = playwrightHelper.getPage();
  const images = page.locator('img');
  const count = await images.count();
  Promise.all(
    Array.from(Array(count), (_, i) => {
      const imageParent = images.nth(i).locator('..');
      const path = imageParent.locator('p').textContent();
      expect(path).not.toBe('');
    }),
  );
});

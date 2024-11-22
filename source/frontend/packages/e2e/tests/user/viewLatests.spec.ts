import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('新着記事を一覧表示するページにアクセスする', async ({ page }) => {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  await page.goto(`${process.env.TEST_TARGET_URL}/posts/latests`);
});

Then('複数の記事が表示される', async ({ page }) => {
  const posts = page.getByRole('listitem');
  const count = await posts.count();
  expect(count).toBeGreaterThan(1);
});

Then('各記事に記事タイトルが表示される', async ({ page }) => {
  const posts = page.getByRole('listitem');
  const count = await posts.count();

  // 各記事に対して h2 要素が存在するかを確認
  await Promise.all(
    Array.from(Array(count), (_, i) =>
      expect(posts.nth(i).getByRole('heading', { level: 2 })).toBeVisible(),
    ),
  );
});

Then('各記事に記事サムネイルが表示される', async ({ page }) => {
  const posts = page.getByRole('listitem');
  const count = await posts.count();

  // 各記事に対して image 要素が存在するかを確認
  await Promise.all(
    Array.from(Array(count), (_, i) =>
      expect(posts.nth(i).getByRole('img', { level: 2 })).toBeVisible(),
    ),
  );
});

Then('各記事に投稿日が表示される', async ({ page }) => {
  const posts = page.getByRole('listitem');
  const count = await posts.count();

  // 各記事に対して image 要素が存在するかを確認
  await Promise.all(
    Array.from(Array(count), (_, i) =>
      expect(
        posts.nth(i).getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/),
      ).toBeVisible(),
    ),
  );
});

Then('各記事は新着順で並んでいる', async ({ page }) => {
  const posts = page.getByRole('listitem');
  const count = await posts.count();

  // 各記事に対して投稿日時を取得し、Date型に変換
  const postDates = Array(count).map(async (_, i) => {
    const postDateElement = await posts
      .nth(i)
      .getByText(/投稿日:(\d{4}\/\d{1,2}\/\d{1,2})/)
      .textContent();
    if (!postDateElement) {
      throw new Error('投稿日時が取得できませんでした');
    }
    return new Date(postDateElement);
  });

  for (let i = 0; i < postDates.length - 1; i++) {
    expect(postDates[i] >= postDates[i + 1]).toBeTruthy();
  }
});

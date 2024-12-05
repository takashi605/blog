import { Before, Given, setDefaultTimeout, Then } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import { chromium, expect } from '@playwright/test';

let page: Page;

Before(async () => {
  setDefaultTimeout(15000);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

Given('新着記事を一覧表示するページにアクセスする', async () => {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  await page.goto(`${process.env.TEST_TARGET_URL}/posts/latests`);
});

Then('ページタイトルが表示される', async () => {
  expect(page.getByRole('heading', { level: 2 })).toHaveText('新着記事');
});

Then('複数の記事が表示される', async () => {
  const posts = page.getByRole('listitem');
  const count = await posts.count();
  expect(count).toBeGreaterThan(1);
});

Then('各記事に記事タイトルが表示される', async () => {
  const posts = page.getByRole('listitem');
  const count = await posts.count();

  // 各記事に対して h2 要素が存在するかを確認
  await Promise.all(
    Array.from(Array(count), (_, i) =>
      expect(posts.nth(i).getByRole('heading', { level: 3 })).toBeVisible(),
    ),
  );
});

Then('各記事に記事サムネイルが表示される', async () => {
  const posts = page.getByRole('listitem');
  const count = await posts.count();

  // 各記事に対して image 要素が存在するかを確認
  await Promise.all(
    Array.from(Array(count), (_, i) =>
      expect(posts.nth(i).getByRole('img')).toBeVisible(),
    ),
  );
});

Then('各記事に投稿日が表示される', async () => {
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

Then('各記事は新着順で並んでいる', async () => {
  const posts = page.getByRole('listitem');
  const count = await posts.count();

  // 各記事に対して投稿日時を取得し、Date型に変換
  const postDateElements = [...Array(count)].map((_, i) => {
    const postDateElement = posts
      .nth(i)
      .getByText(/投稿日:(\d{4}\/\d{1,2}\/\d{1,2})/);

    return postDateElement;
  });

  const postDates = postDateElements.map(async (element) => {
    const postDate = await element.textContent();
    if (!postDate) {
      throw new Error('投稿日時が取得できませんでした');
    }
    const replacedPostDate = postDate.replace('投稿日:', '');

    return new Date(replacedPostDate);
  });

  const resolvedPostDates = await Promise.all(postDates);

  for (let i = 0; i < resolvedPostDates.length - 1; i++) {
    expect(resolvedPostDates[i] <= resolvedPostDates[i + 1]).toBeTruthy();
  }
});

Given('トップページにアクセスして沈着記事を閲覧する', async () => {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  await page.goto(`${process.env.TEST_TARGET_URL}`);
});
Then('新着記事3件分の記事タイトルが表示される', async () => {
  const latestsSection = getLatestsSectionInTopPage(page);
  const titles = latestsSection.locator('h3');
  expect(await titles.count()).toBe(3);
});
Then('新着記事3件分の記事サムネイルが表示される', async () => {
  const latestsSection = getLatestsSectionInTopPage(page);
  const thumbnailImages = latestsSection.locator('img');
  expect(await thumbnailImages.count()).toBe(3);
});
Then('新着記事3件分の投稿日が表示される', async () => {
  const latestsSection = getLatestsSectionInTopPage(page);
  const postDates = latestsSection.getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/);
  expect(await postDates.count()).toBe(3);
});
Then('新着記事は新着順で並んでいる', async () => {
  const latestsSection = getLatestsSectionInTopPage(page);

  const posts = latestsSection.getByRole('listitem');
  const count = await posts.count();

  // 各記事に対して投稿日時を取得し、Date型に変換
  const postDateElements = [...Array(count)].map((_, i) => {
    const postDateElement = posts
      .nth(i)
      .getByText(/投稿日:(\d{4}\/\d{1,2}\/\d{1,2})/);

    return postDateElement;
  });

  const postDates = postDateElements.map(async (element) => {
    const postDate = await element.textContent();
    if (!postDate) {
      throw new Error('投稿日時が取得できませんでした');
    }
    const replacedPostDate = postDate.replace('投稿日:', '');

    return new Date(replacedPostDate);
  });

  const resolvedPostDates = await Promise.all(postDates);

  for (let i = 0; i < resolvedPostDates.length - 1; i++) {
    expect(resolvedPostDates[i] <= resolvedPostDates[i + 1]).toBeTruthy();
  }
});

function getLatestsSectionInTopPage(page: Page) {
  const latestsSectionTitle = page.locator('h2', { hasText: '新着記事' });
  return page.locator('section', { has: latestsSectionTitle });
}

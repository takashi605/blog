import { Given, Then } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

Given('新着記事を一覧表示するページにアクセスする', async function () {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();

  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/v2/blog/posts/latest') &&
        resp.status() === 200,
    ),
    page.goto(`${process.env.TEST_TARGET_URL}/posts/latest`),
  ]);

  // fetch 完了を待つ
  expect(response.status()).toBe(200);
  await response.json();
});

Then('ページタイトルが表示される', async function () {
  const page = playwrightHelper.getPage();

  expect(page.getByRole('heading', { level: 2 })).toHaveText('新着記事');
});

Then('複数の記事が表示される', async function () {
  const page = playwrightHelper.getPage();
  const latestsSection = getLatestsSectionInPage(page);

  const posts = latestsSection.getByRole('link');
  const count = await posts.count();
  expect(count).toBeGreaterThan(1);
});

Then('各記事に記事タイトルが表示される', async function () {
  const page = playwrightHelper.getPage();
  const latestsSection = getLatestsSectionInPage(page);

  const posts = latestsSection.getByRole('link');
  const count = await posts.count();

  // 各記事に対して h2 要素が存在するかを確認
  await Promise.all(
    Array.from(Array(count), (_, i) =>
      expect(posts.nth(i).getByRole('heading', { level: 3 })).toBeVisible({
        timeout: 10000,
      }),
    ),
  );
});

Then('各記事に記事サムネイルが表示される', async function () {
  const page = playwrightHelper.getPage();
  const latestsSection = getLatestsSectionInPage(page);

  const posts = latestsSection.getByRole('link');
  const count = await posts.count();

  // 各記事に対して image 要素が存在するかを確認
  await Promise.all(
    Array.from(Array(count), (_, i) =>
      expect(posts.nth(i).getByRole('img')).toBeVisible({ timeout: 10000 }),
    ),
  );
});

Then('各記事に投稿日が表示される', async function () {
  const page = playwrightHelper.getPage();
  const latestsSection = getLatestsSectionInPage(page);

  const posts = latestsSection.getByRole('link');
  const count = await posts.count();

  // 各記事に対して image 要素が存在するかを確認
  await Promise.all(
    Array.from(Array(count), (_, i) =>
      expect(
        posts.nth(i).getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/),
      ).toBeVisible({ timeout: 10000 }),
    ),
  );
});

Then('各記事は新着順で並んでいる', async function () {
  const page = playwrightHelper.getPage();
  const latestsSection = getLatestsSectionInPage(page);

  const posts = latestsSection.getByRole('link');
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
    expect(resolvedPostDates[i] >= resolvedPostDates[i + 1]).toBeTruthy();
  }
});

Given('トップページにアクセスして新着記事を閲覧する', async function () {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();

  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/v2/blog/posts/latest') &&
        resp.status() === 200,
    ),
    page.goto(`${process.env.TEST_TARGET_URL}`),
  ]);

  // fetch 完了を待つ
  expect(response.status()).toBe(200);
  await response.json();
});
Then('新着記事3件分以上の記事タイトルが表示される', async function () {
  const page = playwrightHelper.getPage();

  const latestsSection = getLatestsSectionInPage(page);
  const titles = latestsSection.locator('h3');
  expect(await titles.count()).toBeGreaterThanOrEqual(3);
});
Then('新着記事3件分以上の記事サムネイルが表示される', async function () {
  const page = playwrightHelper.getPage();

  const latestsSection = getLatestsSectionInPage(page);
  const thumbnailImages = latestsSection.locator('img');
  expect(await thumbnailImages.count()).toBeGreaterThanOrEqual(3);
});
Then('新着記事3件分以上の投稿日が表示される', async function () {
  const page = playwrightHelper.getPage();

  const latestsSection = getLatestsSectionInPage(page);
  const postDates = latestsSection.getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/);
  expect(await postDates.count()).toBeGreaterThanOrEqual(3);
});
Then('新着記事は新着順で並んでいる', async function () {
  const page = playwrightHelper.getPage();

  const latestsSection = getLatestsSectionInPage(page);

  // 一覧ページへのリンクボタンもあるので、
  // heading 要素を持つ a 要素を取得する
  const posts = latestsSection.locator('a', {
    has: page.getByRole('heading', { level: 3 }),
  });
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
    expect(resolvedPostDates[i] >= resolvedPostDates[i + 1]).toBeTruthy();
  }
});
Then('非公開記事が表示されていない', async function () {
  const page = playwrightHelper.getPage();

  const latestsSection = getLatestsSectionInPage(page);
  const titles = latestsSection.locator('h3');

  // 「50年後記事1」が非公開記事なので、titles の中に存在しないことを確認
  const isVisible = await titles
    .filter({ hasText: '50年後記事1' })
    .first()
    .isVisible();
  expect(isVisible).toBeFalsy();
});

function getLatestsSectionInPage(page: Page) {
  const latestsSectionTitle = page.locator('h2', { hasText: '新着記事' });
  return page.locator('section', { has: latestsSectionTitle });
}

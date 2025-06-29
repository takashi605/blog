import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../../support/playwrightHelper.js';

if (!process.env.ADMIN_URL) {
  throw new Error('ADMIN_URL 環境変数が設定されていません');
}

// テストデータの記事ID（既存記事を使用）
const testPostId = '672f2772-72b5-404a-8895-b1fbbf310801';

Given(
  '【正常系 記事編集 更新日】既存記事の記事編集ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    await page.goto(`${process.env.ADMIN_URL}/posts/${testPostId}/edit`, {
      timeout: 20000,
    });
  },
);

Then(
  '【正常系 記事編集 更新日】リッチテキストエディタが表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toBeVisible({ timeout: 10000 });
  },
);

When(
  '【正常系 記事編集 更新日】タイトルに「{string}」と入力する',
  async function (title: string) {
    const page = playwrightHelper.getPage();
    const titleInput = page.getByRole('textbox', { name: 'タイトル' });

    // 既存のタイトルをクリアして新しいタイトルを入力
    await titleInput.fill(title);
  },
);

When(
  '【正常系 記事編集 更新日】タイトルに「更新日編集テスト」と入力する',
  async function () {
    const page = playwrightHelper.getPage();
    const titleInput = page.getByRole('textbox', { name: 'タイトル' });

    // 既存のタイトルをクリアして新しいタイトルを入力
    await titleInput.fill('更新日編集テスト');
  },
);

Then(
  '【正常系 記事編集 更新日】タイトルに「{string}」と表示されている',
  async function (title: string) {
    const page = playwrightHelper.getPage();
    const titleInput = page.getByRole('textbox', { name: 'タイトル' });
    await expect(titleInput).toHaveValue(title);
  },
);

Then(
  '【正常系 記事編集 更新日】タイトルに「更新日編集テスト」と表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    const titleInput = page.getByRole('textbox', { name: 'タイトル' });
    await expect(titleInput).toHaveValue('更新日編集テスト');
  },
);

When('【正常系 記事編集 更新日】「編集確定」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();
  const updateButton = page.getByRole('button', { name: '編集確定' });
  await updateButton.first().click();
});

Then(
  '【正常系 記事編集 更新日】記事が編集され、編集完了ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();

    // 編集完了メッセージの確認
    await expect(page.getByText('記事を更新しました')).toBeVisible({
      timeout: 10000,
    });
  },
);

Then(
  '【正常系 記事編集 更新日】編集した記事へのリンクが表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    // 編集した記事へのリンクが表示されていることを確認
    const articleLink = page.getByRole('link', {
      name: '編集した記事を確認する',
    });
    await expect(articleLink).toBeVisible();
  },
);

When(
  '【正常系 記事編集 更新日】編集した記事のページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();

    // 編集した記事へのリンクをクリック
    const articleLink = page.getByRole('link', {
      name: '編集した記事を確認する',
    });
    await articleLink.click();
  },
);

Then(
  '【正常系 記事編集 更新日】タイトルが「{string}」になっている',
  async function (title: string) {
    const page = playwrightHelper.getPage();

    const titleElement = page.locator('h1');
    await expect(titleElement).toHaveText(title);
  },
);

Then(
  '【正常系 記事編集 更新日】タイトルが「更新日編集テスト」になっている',
  async function () {
    const page = playwrightHelper.getPage();

    const titleElement = page.locator('h1');
    await expect(titleElement).toHaveText('更新日編集テスト');
  },
);

Then(
  '【正常系 記事編集 更新日】投稿日が自動更新されずに、今日の日付になっていない',
  async function () {
    const page = playwrightHelper.getPage();

    const today = new Date().toISOString().split('T')[0];
    const publishedDateElement = page.getByTestId('published-date');

    // 投稿日が今日の日付でないことを確認
    await expect(publishedDateElement).not.toContainText(today);
  },
);

Then(
  '【正常系 記事編集 更新日】更新日が自動更新されて、今日の日付になっている',
  async function () {
    const page = playwrightHelper.getPage();

    const today = new Date().toISOString().split('T')[0];
    const updatedDateElement = page.getByTestId('updated-date');

    // 更新日が今日の日付になっていることを確認
    await expect(updatedDateElement).toContainText(today);
  },
);

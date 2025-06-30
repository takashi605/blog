import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../../support/playwrightHelper.js';

if (!process.env.ADMIN_URL) {
  throw new Error('ADMIN_URL 環境変数が設定されていません');
}

// テストデータの記事ID（E2Eテスト専用記事を使用）
const testPostId = 'e2e00000-ed17-4000-b000-000000000001';

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
    await expect(page.getByText('記事を編集しました')).toBeVisible({
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
      name: '編集した記事を見る',
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
      name: '編集した記事を見る',
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

    const today = new Date();
    const todayFormatted = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    
    // 投稿日が今日の日付でないことを確認（正規表現パターンで投稿日を取得）
    await expect(page.getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/)).not.toContainText(todayFormatted);
  },
);

Then(
  '【正常系 記事編集 更新日】更新日が自動更新されて、今日の日付になっている',
  async function () {
    const page = playwrightHelper.getPage();

    const today = new Date();
    const todayFormatted = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

    // 更新日が今日の日付になっていることを確認（正規表現パターンで更新日を取得）
    await expect(page.getByText(/更新日:\d{4}\/\d{1,2}\/\d{1,2}/)).toContainText(todayFormatted);
  },
);

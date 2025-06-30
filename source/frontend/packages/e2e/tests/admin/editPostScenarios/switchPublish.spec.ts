import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../../support/playwrightHelper.js';

if (!process.env.ADMIN_URL) {
  throw new Error('ADMIN_URL 環境変数が設定されていません');
}

if (!process.env.TEST_TARGET_URL) {
  throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
}

// テストデータの記事ID（E2Eテスト専用記事を使用）
const testPostId = 'e2e00000-ed17-4000-b000-000000000001';

Given(
  '【正常系 記事編集 記事の公開,非公開】記事編集ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    await page.goto(`${process.env.ADMIN_URL}/posts/${testPostId}/edit`, {
      timeout: 20000,
    });
  },
);

When(
  '【正常系 記事編集 記事の公開,非公開】公開日を未来の日付にして編集を確定',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 未来の日付を計算（明日の日付）
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDate = tomorrow.toISOString().split('T')[0];
    
    // 公開日を未来の日付に設定
    const publishedAtInput = page.getByRole('combobox', { name: '公開日' });
    await publishedAtInput.fill(futureDate);
    
    // 編集確定ボタンを押す
    const updateButton = page.getByRole('button', { name: '編集確定' });
    await updateButton.first().click();
    
    // 編集完了メッセージの確認
    await expect(page.getByText('記事を編集しました')).toBeVisible({
      timeout: 10000,
    });
  },
);

When(
  '【正常系 記事編集 記事の公開,非公開】記事閲覧ページにアクセスする',
  async function () {
    const revalidateTime = 2000; // 2秒のリバリデート時間
    // リバリデートのために少し待機
    await new Promise(resolve => setTimeout(resolve, revalidateTime));

    const page = playwrightHelper.getPage();
    
    // 記事閲覧ページにアクセス
    await page.goto(`${process.env.TEST_TARGET_URL}/posts/${testPostId}`, {
      timeout: 20000,
    });
  },
);

Then(
  '【正常系 記事編集 記事の公開,非公開】404ページが表示される',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 404ページまたは記事が非公開であることを確認
    // ページタイトルが404であるか、または記事が見つからないメッセージが表示される
    await expect(
      page.getByText('お探しのページは見つかりませんでした').or(
        page.getByText('404')
      )
    ).toBeVisible({ timeout: 10000 });
  },
);

Given(
  '【正常系 記事編集 記事の公開,非公開】再度、記事編集ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    await page.goto(`${process.env.ADMIN_URL}/posts/${testPostId}/edit`, {
      timeout: 20000,
    });
  },
);

When(
  '【正常系 記事編集 記事の公開,非公開】公開日を今日の日付にして編集を確定',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 今日の日付を取得
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    
    // 公開日を今日の日付に設定
    const publishedAtInput = page.getByRole('combobox', { name: '公開日' });
    await publishedAtInput.fill(todayDate);
    
    // 編集確定ボタンを押す
    const updateButton = page.getByRole('button', { name: '編集確定' });
    await updateButton.first().click();
    
    // 編集完了メッセージの確認
    await expect(page.getByText('記事を編集しました')).toBeVisible({
      timeout: 10000,
    });
  },
);

Then(
  '【正常系 記事編集 記事の公開,非公開】記事が表示される',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 記事のタイトルまたは本文が表示されていることを確認
    // h1タグが存在することで記事が正常に表示されていることを確認
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  },
);
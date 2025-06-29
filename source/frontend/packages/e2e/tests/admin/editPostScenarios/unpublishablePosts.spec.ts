import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../../support/playwrightHelper.js';

if (!process.env.ADMIN_URL) {
  throw new Error('ADMIN_URL 環境変数が設定されていません');
}

if (!process.env.TEST_TARGET_URL) {
  throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
}

// テストデータの記事ID（人気記事、ピックアップ記事、トップテックピック記事）
const popularPostId = 'f735a7b7-8bbc-4cb5-b6cf-c188734f64d3'; // 人気記事
const pickupPostId = '20b73825-9a6f-4901-aa42-e104a8d2c4f6'; // ピックアップ記事
const topTechPickPostId = '672f2772-72b5-404a-8895-b1fbbf310801'; // トップテックピック記事

Given(
  '【正常系 記事編集 非公開不可の記事】人気記事に設定されている記事の編集ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    await page.goto(`${process.env.ADMIN_URL}/posts/${popularPostId}/edit`, {
      timeout: 20000,
    });
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】人気記事の公開日を未来の日付にして編集を確定',
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
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】人気記事は非公開にできない旨のエラーメッセージが表示される',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 人気記事は非公開にできない旨のエラーメッセージが表示される
    await expect(
      page.getByText('人気記事に設定されているため非公開にできません')
    ).toBeVisible({
      timeout: 10000,
    });
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】人気記事の記事閲覧ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 記事閲覧ページにアクセス
    await page.goto(`${process.env.TEST_TARGET_URL}/posts/${popularPostId}`, {
      timeout: 20000,
    });
  },
);

Then(
  '【正常系 記事編集 非公開不可の記事】人気記事が表示される',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 記事のタイトルまたは本文が表示されていることを確認
    // h1タグが存在することで記事が正常に表示されていることを確認
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】ピックアップ記事に設定されている記事の編集ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    await page.goto(`${process.env.ADMIN_URL}/posts/${pickupPostId}/edit`, {
      timeout: 20000,
    });
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】ピックアップ記事の公開日を未来の日付にして編集を確定',
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
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】ピックアップ記事は非公開にできない旨のエラーメッセージが表示される',
  async function () {
    const page = playwrightHelper.getPage();
    
    // ピックアップ記事は非公開にできない旨のエラーメッセージが表示される
    await expect(
      page.getByText('ピックアップ記事に設定されているため非公開にできません')
    ).toBeVisible({
      timeout: 10000,
    });
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】ピックアップ記事の記事閲覧ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 記事閲覧ページにアクセス
    await page.goto(`${process.env.TEST_TARGET_URL}/posts/${pickupPostId}`, {
      timeout: 20000,
    });
  },
);

Then(
  '【正常系 記事編集 非公開不可の記事】ピックアップ記事が表示される',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 記事のタイトルまたは本文が表示されていることを確認
    // h1タグが存在することで記事が正常に表示されていることを確認
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】トップテックピック記事に設定されている記事の編集ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    await page.goto(`${process.env.ADMIN_URL}/posts/${topTechPickPostId}/edit`, {
      timeout: 20000,
    });
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】トップテックピック記事の公開日を未来の日付にして編集を確定',
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
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】トップテックピック記事は非公開にできない旨のエラーメッセージが表示される',
  async function () {
    const page = playwrightHelper.getPage();
    
    // トップテックピック記事は非公開にできない旨のエラーメッセージが表示される
    await expect(
      page.getByText('トップテックピック記事に設定されているため非公開にできません')
    ).toBeVisible({
      timeout: 10000,
    });
  },
);

When(
  '【正常系 記事編集 非公開不可の記事】トップテックピック記事の記事閲覧ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 記事閲覧ページにアクセス
    await page.goto(`${process.env.TEST_TARGET_URL}/posts/${topTechPickPostId}`, {
      timeout: 20000,
    });
  },
);

Then(
  '【正常系 記事編集 非公開不可の記事】トップテックピック記事が表示される',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 記事のタイトルまたは本文が表示されていることを確認
    // h1タグが存在することで記事が正常に表示されていることを確認
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  },
);
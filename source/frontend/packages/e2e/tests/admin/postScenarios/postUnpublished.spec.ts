import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../../support/playwrightHelper.js';

Given('【正常系 未公開投稿】記事投稿ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/posts/create`, { timeout: 20000 });
});

Then(
  '【正常系 未公開投稿】リッチテキストエディタが表示されていることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toBeVisible({ timeout: 10000 });
  },
);

When(
  '【正常系 未公開投稿】タイトルに「テスト未公開記事」と入力する',
  async function () {
    const page = playwrightHelper.getPage();

    const titleInput = page.getByRole('textbox', { name: 'タイトル' });
    await titleInput.fill('テスト未公開記事');
  },
);

Then(
  '【正常系 未公開投稿】タイトルに「テスト未公開記事」と表示される',
  async function () {
    const page = playwrightHelper.getPage();

    const titleInput = page.getByRole('textbox', { name: 'タイトル' });
    await expect(titleInput).toHaveValue('テスト未公開記事');
  },
);

When(
  '【正常系 未公開投稿】サムネイル画像選択モーダルを開き、サムネイル画像を選択する',
  async () => {
    const page = playwrightHelper.getPage();

    const openModalButton = page.getByRole('button', {
      name: 'サムネイル画像を選択',
    });
    await openModalButton.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });

    const labelsInModal = modal.locator('label');
    const firstLabelInModal = labelsInModal.first();
    await firstLabelInModal.click();

    // 選択ボタンをクリック
    const selectButton = modal.getByRole('button', { name: '選択' });
    await selectButton.click();
  },
);

Then(
  '【正常系 未公開投稿】投稿画面内にサムネイル画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const thumbnailImage = page.getByRole('img', { name: 'サムネイル画像' });
    await expect(thumbnailImage).toBeVisible();
  },
);

When('【正常系 未公開投稿】公開日を未来の日付に設定する', async function () {
  const page = playwrightHelper.getPage();

  // 明日の日付を YYYY-MM-DD 形式で取得
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  const publishDateInput = page.getByRole('combobox', { name: '公開日' });
  await publishDateInput.fill(tomorrowString);
});

Then(
  '【正常系 未公開投稿】公開日が未来の日付に設定されていることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    // 明日の日付を YYYY-MM-DD 形式で取得
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    const publishDateInput = page.getByRole('combobox', { name: '公開日' });
    await expect(publishDateInput).toHaveValue(tomorrowString);
  },
);

When(
  '【正常系 未公開投稿】リッチテキストエディタに「こんにちは！未公開記事」と入力する',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await richTextEditor.pressSequentially('こんにちは！未公開記事', {
      timeout: 10000,
    });
    await page.waitForTimeout(200);
  },
);

Then(
  '【正常系 未公開投稿】リッチテキストエディタに「こんにちは！未公開記事」が表示される',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toHaveText('こんにちは！未公開記事', {
      timeout: 10000,
    });
  },
);

When('【正常系 未公開投稿】「投稿」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();
  const publishButton = page.getByRole('button', { name: '投稿' });

  await Promise.all([
    page.waitForURL('**/posts/create/success**'),
    publishButton.click(),
  ]);
});

Then(
  '【正常系 未公開投稿】記事が未公開状態で投稿され、投稿完了ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();

    await expect(page.getByText('記事を公開しました')).toBeVisible({
      timeout: 10000,
    });
  },
);

Then(
  '【正常系 未公開投稿】投稿した記事へのリンクが表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const postedPageLink = page.locator('a', { hasText: '投稿した記事を見る' });
    await expect(postedPageLink).toBeVisible();
  },
);

When(
  '【正常系 未公開投稿】投稿した記事のページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();

    const postedPageLink = page.locator('a', { hasText: '投稿した記事を見る' });
    await postedPageLink.click();
  },
);

Then(
  '【正常系 未公開投稿】404 ページが表示されることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    // 404ページまたは記事が見つからないことを示すメッセージを確認
    await expect(page.getByText('404')).toBeVisible({
      timeout: 10000,
    });
  },
);

When(
  '【正常系 未公開投稿】新着記事一覧ページにアクセスする',
  async function () {
    if (!process.env.TEST_TARGET_URL) {
      throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
    }
    const page = playwrightHelper.getPage();

    await page.goto(`${process.env.TEST_TARGET_URL}/posts/latest`);
  },
);

Then(
  '【正常系 未公開投稿】未公開の記事が新着記事一覧ページに表示されていないことを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    // 未公開記事のタイトルが表示されていないことを確認
    const unpublishedArticleTitle = page.getByText('テスト未公開記事');
    await expect(unpublishedArticleTitle).not.toBeVisible();
  },
);

When('【正常系 未公開投稿】記事管理ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/admin/blog/posts') && resp.status() === 200,
    ),
    page.goto(`${process.env.ADMIN_URL}/posts`, { timeout: 20000 }),
  ]);
  await response.json();
});

Then(
  '【正常系 未公開投稿】記事管理ページに未公開の記事が表示されていることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    // 未公開記事のタイトルが表示されていることを確認
    const unpublishedArticleTitle = page.getByText('テスト未公開記事');
    await expect(unpublishedArticleTitle).toBeVisible({ timeout: 10000 });
  },
);

When(
  '【正常系 未公開投稿】人気記事選択ページにアクセスし、「人気記事を選択」ボタンを押下する',
  async function () {
    if (!process.env.ADMIN_URL) {
      throw new Error('ADMIN_URL 環境変数が設定されていません');
    }
    const page = playwrightHelper.getPage();
    await page.goto(`${process.env.ADMIN_URL}/posts/popular`, {
      timeout: 20000,
    });

    const selectPopularButton = page.getByRole('button', {
      name: '人気記事を選択',
    });

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/admin/blog/posts') && resp.status() === 200,
      ),
      selectPopularButton.click(),
    ]);

    await response.json();
  },
);

Then(
  '【正常系 未公開投稿】人気記事選択モーダルが表示されることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });
  },
);

Then(
  '【正常系 未公開投稿】未公開の記事が人気記事選択モーダルに表示されていないことを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    const modal = page.getByRole('dialog');

    // 記事タイトル一覧がモーダルに表示されていることを確認
    const postTitles = modal.locator('h3');
    await expect(postTitles.first()).toBeVisible({ timeout: 10_000 });

    // 未公開記事のタイトルが表示されていないことを確認
    const unpublishedArticleTitle = modal.getByText('テスト未公開記事');
    await expect(unpublishedArticleTitle).not.toBeVisible();
  },
);

When(
  '【正常系 未公開投稿】モーダルを閉じて、ピックアップ記事選択ページにアクセスし、「ピックアップ記事を選択」ボタンを押下する',
  async function () {
    const page = playwrightHelper.getPage();

    // モーダルを閉じる
    const modal = page.getByRole('dialog');
    const closeButton = modal.getByRole('button', { name: '閉じる' });
    await closeButton.click();

    if (!process.env.ADMIN_URL) {
      throw new Error('ADMIN_URL 環境変数が設定されていません');
    }
    await page.goto(`${process.env.ADMIN_URL}/posts/pickup`, {
      timeout: 20000,
    });

    const selectPickupButton = page.getByRole('button', {
      name: 'ピックアップ記事を選択',
    });

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/admin/blog/posts') && resp.status() === 200,
      ),
      selectPickupButton.click(),
    ]);

    await response.json();
  },
);

Then(
  '【正常系 未公開投稿】ピックアップ記事選択モーダルが表示されることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });
  },
);

Then(
  '【正常系 未公開投稿】未公開の記事がピックアップ記事選択モーダルに表示されていないことを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    const modal = page.getByRole('dialog');

    // 記事タイトル一覧がモーダルに表示されていることを確認
    const postTitles = modal.locator('h3');
    await expect(postTitles.first()).toBeVisible({ timeout: 10_000 });

    const unpublishedArticleTitle = modal.getByText('テスト未公開記事');
    await expect(unpublishedArticleTitle).not.toBeVisible();
  },
);

When(
  '【正常系 未公開投稿】モーダルを閉じて、トップテックピック記事選択ページにアクセスし、「トップテックピック記事を選択」ボタンを押下する',
  async function () {
    const page = playwrightHelper.getPage();

    // モーダルを閉じる
    const modal = page.getByRole('dialog');
    const closeButton = modal.getByRole('button', { name: '閉じる' });
    await closeButton.click();

    if (!process.env.ADMIN_URL) {
      throw new Error('ADMIN_URL 環境変数が設定されていません');
    }
    await page.goto(`${process.env.ADMIN_URL}/posts/top-tech-pick`, {
      timeout: 20000,
    });

    const selectTopTechPickButton = page.getByRole('button', {
      name: 'トップテックピック記事を選択',
    });

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/admin/blog/posts') && resp.status() === 200,
      ),
      selectTopTechPickButton.click(),
    ]);
    await response.json();
  },
);

Then(
  '【正常系 未公開投稿】トップテックピック記事選択モーダルが表示されることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });
  },
);

Then(
  '【正常系 未公開投稿】未公開の記事がトップテックピック記事選択モーダルに表示されていないことを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    const modal = page.getByRole('dialog');

    // 記事タイトル一覧がモーダルに表示されていることを確認
    const postTitles = modal.locator('h3');
    await expect(postTitles.first()).toBeVisible({ timeout: 10_000 });

    const unpublishedArticleTitle = modal.getByText('テスト未公開記事');
    await expect(unpublishedArticleTitle).not.toBeVisible();
  },
);

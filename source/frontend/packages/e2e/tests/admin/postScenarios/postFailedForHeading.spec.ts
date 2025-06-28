import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../../support/playwrightHelper.js';
import { clearSelectionByArrow, selectByArrowLeft } from './helper.js';

Given('【異常系 記事投稿】記事投稿ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/posts/create`, { timeout: 10000 });
});
Then(
  '【異常系 記事投稿】リッチテキストエディタが表示されていることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toBeVisible({ timeout: 20000 });
  },
);

When(
  '【異常系 記事投稿】タイトルに「テスト記事2」と入力する',
  async function () {
    const page = playwrightHelper.getPage();

    const titleInput = page.getByRole('textbox', { name: 'タイトル' });
    await titleInput.fill('テスト記事2');
  },
);
When(
  '【異常系 記事投稿】サムネイル画像選択モーダルを開き、サムネイル画像を選択する',
  async () => {
    // 参考：https://playwright.dev/docs/api/class-filechooser
    const page = playwrightHelper.getPage();

    const openModalButton = page.getByRole('button', {
      name: 'サムネイル画像を選択',
    });
    await openModalButton.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 対応する画像をクリックし、src 属性を取得して変数に保持
    const labelsInModal = modal.locator('label');
    const firstLabelInModal = labelsInModal.first();
    await firstLabelInModal.click();

    const closeButton = modal.getByRole('button', { name: '閉じる' });
    await closeButton.click();
  },
);

When(
  '【異常系 記事投稿】リッチテキストエディタに101文字以上入力し、その文字を選択して「h2」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    // テキストをセット
    await richTextEditor.pressSequentially('あ'.repeat(101), {
      timeout: 10000,
    });
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    await selectByArrowLeft(page, richTextEditor, 101);
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    // h2ボタンを押す
    const h2Button = page.getByRole('checkbox', { name: 'h2' });
    await h2Button.click();

    // 選択の解除
    await clearSelectionByArrow(page, richTextEditor);
  },
);
Then(
  '【異常系 記事投稿】リッチテキストエディタにレベル2見出しが表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    const h2Text = richTextEditor.locator('h2');
    await expect(h2Text).toHaveText('あ'.repeat(101), { timeout: 10000 });
  },
);

When('【異常系 記事投稿】「投稿」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const publishButton = page.getByRole('button', { name: '投稿' });
  await publishButton.click();
});
Then('【異常系 記事投稿】エラーメッセージが表示される', async function () {
  const page = playwrightHelper.getPage();

  const errorMessage = page.getByRole('alert');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
});

When('【異常系 記事投稿】新着記事一覧ページにアクセスする', async function () {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();

  await page.goto(`${process.env.TEST_TARGET_URL}/posts/latest`);
});
Then(
  '【異常系 記事投稿】投稿した記事が新着記事一覧ページに表示されていない',
  async function () {
    const page = playwrightHelper.getPage();

    // api リクエストで失敗していないことを確定させるために、新着記事一覧ページが表示されていることを確認
    const latestPageTitle = page.getByRole('heading', { name: '新着記事' });
    await expect(latestPageTitle).toBeVisible({ timeout: 5000 });

    // 1秒ごとに5回リロードして、記事が表示されていないことを確認
    for (let i = 0; i < 5; i++) {
      // キャッシュ削除＋再取得
      await page.reload();
      // 必要に応じて API リクエスト完了を待つ
      await page.waitForLoadState('networkidle');
      // 1秒待機（ポーリング間隔）
      await page.waitForTimeout(1000);

      // もしも記事が表示されていたらエラーを投げる
      const count = await page.locator('text=テスト記事2').count();
      if (count > 0) {
        throw new Error(`記事が検出されました（${i + 1}回目のリロード時）`);
      }
    }
  },
);

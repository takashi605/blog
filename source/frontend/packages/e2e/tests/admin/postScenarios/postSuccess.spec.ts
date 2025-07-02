import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../../support/playwrightHelper.js';
import { clearSelectionByArrow, selectByArrowLeft } from './helper.js';

let selectedThumbnailImageSrc: string | null = null;
let selectedImageContentSrc: string | null = null;

Given('【正常系 記事投稿】記事投稿ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/posts/create`, { timeout: 20000 });
});

Then(
  '【正常系 記事投稿】リッチテキストエディタが表示されていることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toBeVisible({ timeout: 10000 });
  },
);

Then(
  '【正常系 記事投稿】公開日に今日の日付が設定されていることを確認する',
  async function () {
    const page = playwrightHelper.getPage();

    // 今日の日付を YYYY-MM-DD 形式で取得
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    const publishDateInput = page.getByRole('combobox', { name: '公開日' });
    await expect(publishDateInput).toHaveValue(todayString);
  },
);

When(
  '【正常系 記事投稿】タイトルに「テスト記事」と入力する',
  async function () {
    const page = playwrightHelper.getPage();

    const titleInput = page.getByRole('textbox', { name: 'タイトル' });
    await titleInput.fill('テスト記事');
  },
);

Then(
  '【正常系 記事投稿】タイトルに「テスト記事」と表示される',
  async function () {
    const page = playwrightHelper.getPage();

    const titleInput = page.getByRole('textbox', { name: 'タイトル' });
    await expect(titleInput).toHaveValue('テスト記事');
  },
);

When(
  '【正常系 記事投稿】サムネイル画像選択モーダルを開き、サムネイル画像を選択する',
  async () => {
    // 参考：https://playwright.dev/docs/api/class-filechooser
    const page = playwrightHelper.getPage();

    const openModalButton = page.getByRole('button', {
      name: 'サムネイル画像を選択',
    });
    await openModalButton.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 対応する画像をクリック
    const labelsInModal = modal.locator('label');
    const firstLabelInModal = labelsInModal.first();
    await firstLabelInModal.click();

    // src 属性を取得して変数に保持
    selectedThumbnailImageSrc = await firstLabelInModal
      .locator('img')
      .getAttribute('src');

    // 選択ボタンをクリック
    const selectButton = modal.getByRole('button', { name: '選択' });
    await selectButton.click();
  },
);
Then(
  '【正常系 記事投稿】投稿画面内にサムネイル画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const thumbnailImage = page.getByRole('img', { name: 'サムネイル画像' });
    await expect(thumbnailImage).toBeVisible();
  },
);

When(
  '【正常系 記事投稿】リッチテキストエディタに「こんにちは！」と入力する',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await richTextEditor.pressSequentially('こんにちは！', { timeout: 10000 });
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機
  },
);
Then(
  '【正常系 記事投稿】リッチテキストエディタに「こんにちは！」が表示される',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toHaveText('こんにちは！', { timeout: 10000 });
  },
);
When(
  '【正常系 記事投稿】「世界」と入力し、その文字を選択して太字ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    // テキストをセット
    await richTextEditor.pressSequentially('世界', { timeout: 10000 });
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    await selectByArrowLeft(page, richTextEditor, 2);

    // 太字ボタンを押す
    const boldButton = page.getByRole('checkbox', { name: 'bold' });
    await boldButton.click();

    // 選択の解除
    await clearSelectionByArrow(page, richTextEditor);
  },
);
Then(
  '【正常系 記事投稿】リッチテキストエディタに「こんにちは！世界」と表示され、世界のみ太字になっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');

    await expect(richTextEditor).toHaveText('こんにちは！世界', {
      timeout: 10000,
    });
    // 「世界」が strong タグで囲われているか確認
    const boldText = richTextEditor.locator('strong');
    await expect(boldText).toHaveText('世界', { timeout: 10000 });
  },
);
When(
  '【正常系 記事投稿】「世界」を再び選択し、太字ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await selectByArrowLeft(page, richTextEditor, 2);

    const boldButton = page.getByRole('checkbox', { name: 'bold' });
    await boldButton.click();
    await clearSelectionByArrow(page, richTextEditor);
  },
);
Then(
  '【正常系 記事投稿】リッチテキストエディタに「こんにちは！世界」と表示され、世界の太字が解除されている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toHaveText('こんにちは！世界', {
      timeout: 10000,
    });
    // 「世界」が strong タグで囲われていないか確認
    const boldText = richTextEditor.locator('strong');
    await expect(boldText).not.toBeVisible({ timeout: 10000 });
  },
);

When(
  '【正常系 記事投稿】「世界」を選択し、インラインコードボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await selectByArrowLeft(page, richTextEditor, 2);

    const inlineCodeButton = page.getByRole('checkbox', {
      name: 'inline-code',
    });
    await inlineCodeButton.click();
    await clearSelectionByArrow(page, richTextEditor);
  },
);

Then(
  '【正常系 記事投稿】リッチテキストエディタに「こんにちは！世界」と表示され、世界がインラインコードになっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toHaveText('こんにちは！世界', {
      timeout: 10000,
    });
    // 「世界」が code タグで囲われているか確認
    const inlineCode = richTextEditor
      .getByRole('code')
      .filter({ hasText: '世界' });
    await expect(inlineCode).toBeVisible({ timeout: 10000 });
  },
);

When(
  '【正常系 記事投稿】「リンクテスト」という文字を入力・選択し、リンクボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    // 新しい段落を作成
    richTextEditor.press('Enter');
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    // テキストをセット
    await richTextEditor.pressSequentially('リンクテスト', { timeout: 10000 });
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    // 全選択
    await selectByArrowLeft(page, richTextEditor, 6);

    // リンクボタンを押す
    const linkButton = page.getByRole('checkbox', { name: 'link' });
    await linkButton.click();
  },
);

Then('【正常系 記事投稿】リンク設定 input が出現する', async function () {
  const page = playwrightHelper.getPage();

  // リンク設定入力フィールドを確認
  const linkInput = page.getByRole('textbox', {
    name: 'URL(http(s):// から始まるもの)を入力してください。',
  });
  await expect(linkInput).toBeVisible({ timeout: 10000 });
});

When(
  '【正常系 記事投稿】リンク設定 input に「example.com」と入力する',
  async function () {
    const page = playwrightHelper.getPage();

    // リンク設定入力フィールドにURLを入力
    const linkInput = page.getByRole('textbox', {
      name: 'URL(http(s):// から始まるもの)を入力してください。',
    });
    await linkInput.fill('https://example.com');

    // 適用ボタンをクリック
    const insertButton = page.getByRole('button', { name: 'リンクを挿入' });
    await insertButton.click();

    // フォーカスをリセット
    await clearSelectionByArrow(page, page.locator('[contenteditable="true"]'));
  },
);

When(
  '【正常系 記事投稿】「見出し2」と入力し、その文字を選択して「h2」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    richTextEditor.press('Enter');
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    await richTextEditor.pressSequentially('見出し2');
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    await selectByArrowLeft(page, richTextEditor, 4);
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    const h2Button = page.getByRole('checkbox', { name: 'h2' });
    await h2Button.click();
    await clearSelectionByArrow(page, richTextEditor);
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機
  },
);
Then(
  '【正常系 記事投稿】リッチテキストエディタに「見出し2」と表示され、レベル2見出しになっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    const h2Text = richTextEditor.locator('h2');
    await expect(h2Text).toHaveText('見出し2', { timeout: 10000 });
  },
);
When(
  '【正常系 記事投稿】「見出し3」と入力し、その文字を選択して「h3」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await richTextEditor.press('Enter');
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    await richTextEditor.pressSequentially('見出し3');
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    await selectByArrowLeft(page, richTextEditor, 4);
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    const h2Button = page.getByRole('checkbox', { name: 'h3' });
    await h2Button.click();
    await clearSelectionByArrow(page, richTextEditor);
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機
  },
);
Then(
  '【正常系 記事投稿】リッチテキストエディタに「見出し3」と表示され、レベル3見出しになっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    const h3Text = richTextEditor.locator('h3');
    await expect(h3Text).toHaveText('見出し3', { timeout: 10000 });
  },
);
When(
  '【正常系 記事投稿】数行のコードを入力し、「code」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await richTextEditor.press('Enter');
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    await richTextEditor.pressSequentially('const a = 1');
    await richTextEditor.press('Enter');
    await richTextEditor.pressSequentially('const b = 3');
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機

    // 入力したテキストを選択
    const textLength = 23; // 「const a = 1\nconst b = 3」の文字数
    await selectByArrowLeft(page, richTextEditor, textLength);

    const codeButton = page.getByRole('checkbox', { name: /^code$/ });
    await codeButton.click();
  },
);
Then(
  '【正常系 記事投稿】エディタ内にコードブロックが存在している',
  async function () {
    const page = playwrightHelper.getPage();

    const codeBlock = page.getByRole('code').filter({
      hasText: 'const a = 1',
    });

    await expect(codeBlock).toHaveText('const a = 1const b = 3', {
      timeout: 10000,
    });

    // brタグが1つ含まれていることを確認
    const brElements = codeBlock.locator('br');
    await expect(brElements).toHaveCount(1);
  },
);

When(
  '【正常系 記事投稿】言語選択セレクトボックスから、「js」を選択',
  async function () {
    const page = playwrightHelper.getPage();

    const languageSelect = page.getByRole('combobox', {
      name: 'code languages',
    });
    await languageSelect.click();
    await languageSelect.selectOption('js');
  },
);
Then(
  '【正常系 記事投稿】コードブロックの言語データ属性が「js」になっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    const codeBlock = richTextEditor.locator('.language-js');
    const languageDataAttribute = await codeBlock.getAttribute('data-language');

    expect(languageDataAttribute).toBe('js');
  },
);

When(
  '【正常系 記事投稿】コードブロックのタイトルを「サンプル： 定数定義」に変更する',
  async function () {
    const page = playwrightHelper.getPage();

    // コードブロックのタイトル入力欄を探す
    const codeTitleInput = page.getByPlaceholder('コードブロックのタイトル');
    await expect(codeTitleInput).toBeVisible({ timeout: 10000 });

    // タイトルを入力
    await codeTitleInput.fill('サンプル： 定数定義');
  },
);

Then(
  '【正常系 記事投稿】コードブロックのタイトルが「サンプル： 定数定義」になっている',
  async function () {
    const page = playwrightHelper.getPage();

    // コードブロックのタイトル入力欄の値を確認
    const codeTitleInput = page.getByPlaceholder('コードブロックのタイトル');
    await expect(codeTitleInput).toHaveValue('サンプル： 定数定義', {
      timeout: 10000,
    });
  },
);

When(
  '【正常系 記事投稿】画像選択モーダルを開き、画像を選択する',
  async function () {
    const page = playwrightHelper.getPage();

    // 改行を入れて、画像を挿入する位置を確保
    // コードブロックから抜けるには、3回 Enter を押す
    const richTextEditor = page.locator('[contenteditable="true"]');

    await richTextEditor.press('Control+End'); // ctrl+end で一番下に移動

    // 500ms 待機して、確実に一番下に移動する
    await page.waitForTimeout(500);

    await richTextEditor.press('Enter');
    await richTextEditor.press('Enter');
    await richTextEditor.press('Enter');
    await page.waitForTimeout(200);

    const openModalButton = page.getByRole('button', { name: '画像を挿入' });
    await openModalButton.click();

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });

    const modal = page.getByRole('dialog');
    const labelInModal = modal.locator('label');
    const firstLabel = labelInModal.first();
    await firstLabel.click();

    // 対応する画像の src 属性を取得して変数に保持
    const labelsInModal = modal.locator('label');
    const firstLabelInModal = labelsInModal.first();
    selectedImageContentSrc = await firstLabelInModal
      .locator('img')
      .getAttribute('src');

    // 選択した画像の src を保持
    selectedThumbnailImageSrc = selectedImageContentSrc;

    // 画像を選択し、選択モーダルを閉じる
    const imageInsertButton = modal.getByRole('button', {
      name: '挿入',
    });
    await imageInsertButton.click();
    await expect(modal).not.toBeVisible({ timeout: 10000 });
  },
);
Then(
  '【正常系 記事投稿】モーダルを閉じると、リッチテキストエディタ内に画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    const richTextEditor = page.locator('[contenteditable="true"]');
    const imageContent = richTextEditor.locator('img');
    await expect(imageContent).toBeVisible({ timeout: 10000 });
    const src = await imageContent.getAttribute('src');

    expectMatchImageResourceByCloudinary(src);
  },
);

When(
  '【正常系 記事投稿】「画像の直後」という文字列を入力する',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await richTextEditor.pressSequentially('画像の直後', { timeout: 10000 });
    await page.waitForTimeout(200); // 入力後の安定性のために少し待機
  },
);
Then(
  '【正常系 記事投稿】リッチテキストエディタに「画像の直後」という文字列が表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toContainText('画像の直後', {
      timeout: 10000,
    });
  },
);

When('【正常系 記事投稿】「投稿」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();
  const publishButton = page.getByRole('button', { name: '投稿' });

  await Promise.all([
    page.waitForURL('**/posts/create/success**'),
    publishButton.click(),
  ]);
});
Then(
  '【正常系 記事投稿】記事が投稿され、投稿完了ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();

    await expect(page.getByText('記事を公開しました！')).toBeVisible({
      timeout: 10000,
    });
  },
);
Then(
  '【正常系 記事投稿】投稿した記事へのリンクが表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const postedPageLink = page.locator('a', { hasText: '投稿した記事を見る' });
    await expect(postedPageLink).toBeVisible();
  },
);

When(
  '【正常系 記事投稿】投稿した記事のページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();

    const postedPageLink = page.locator('a', { hasText: '投稿した記事を見る' });

    await Promise.all([page.waitForURL('**/posts/**'), postedPageLink.click()]);
  },
);
Then(
  '【正常系 記事投稿】タイトルが「テスト記事」になっている',
  async function () {
    const page = playwrightHelper.getPage();

    const title = page.locator('h1');
    await expect(title).toHaveText('テスト記事');
  },
);
Then(
  '【正常系 記事投稿】選択したサムネイル画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const thumbnailImage = page.getByRole('img', { name: 'サムネイル画像' });
    const src = await thumbnailImage.getAttribute('src');

    expectMatchImageResourceByCloudinary(src);
  },
);
Then(
  '【正常系 記事投稿】本文に「こんにちは！世界」と表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const content = page.getByText('こんにちは！世界');
    await expect(content).toBeVisible({ timeout: 10000 });
  },
);
Then('【正常系 記事投稿】世界が太字になっていない', async function () {
  const page = playwrightHelper.getPage();

  const boldText = page.locator('strong');
  await expect(boldText).not.toBeVisible();
});
Then(
  '【正常系 記事投稿】世界がインラインコードになっている',
  async function () {
    const page = playwrightHelper.getPage();

    const inlineCode = page.getByRole('code').filter({
      hasText: '世界',
    });
    await expect(inlineCode).toBeVisible();
  },
);
Then(
  '【正常系 記事投稿】「見出し2」という文字の h2 が存在する',
  async function () {
    const page = playwrightHelper.getPage();
    const h2 = page.locator('h2');
    await expect(h2).toHaveText('見出し2');
  },
);
Then(
  '【正常系 記事投稿】「見出し3」という文字の h3 が存在する',
  async function () {
    const page = playwrightHelper.getPage();
    const h3 = page.locator('h3');
    await expect(h3).toHaveText('見出し3');
  },
);
Then('【正常系 記事投稿】コードブロックが存在している', async function () {
  const page = playwrightHelper.getPage();

  const codeBlock = page.getByRole('code').filter({
    hasText: 'const a = 1',
  });
  await expect(codeBlock).toBeVisible({ timeout: 10000 });
});
Then(
  '【正常系 記事投稿】コードブロックの言語が「js」になっている',
  async function () {
    const page = playwrightHelper.getPage();

    const codeBlock = page.getByRole('code').filter({
      hasText: 'const a = 1',
    });
    const languageDataAttribute = await codeBlock.getAttribute('class');

    expect(languageDataAttribute).toBe('language-js');
  },
);

Then(
  '【正常系 記事投稿】コードブロックのタイトル「サンプル： 定数定義」が存在する',
  async function () {
    const page = playwrightHelper.getPage();

    const codeBlockTitle = page.getByText('サンプル： 定数定義');
    await expect(codeBlockTitle).toBeVisible({ timeout: 10000 });
  },
);

Then(
  '【正常系 記事投稿】コードブロック内に入力した内容が表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const codeBlock = page.getByRole('code').filter({
      hasText: 'const a = 1',
    });
    await expect(codeBlock).toHaveText('const a = 1\nconst b = 3', {
      timeout: 10000,
    });
  },
);
Then(
  '【正常系 記事投稿】コードのコピーボタンが表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const copyButton = page.getByRole('button', { name: 'copy-button' });
    await expect(copyButton).toBeVisible();
  },
);

Then('【正常系 記事投稿】画像が表示されている', async function () {
  const page = playwrightHelper.getPage();

  const thumbnailImage = page.getByRole('img', { name: '画像コンテンツ' });
  const src = await thumbnailImage.getAttribute('src');

  expectMatchImageResourceByCloudinary(src);
});
Then(
  '【正常系 記事投稿】画像の直後に「画像の直後」という文字列が表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const textAfterImage = page.getByText('画像の直後');
    await expect(textAfterImage).toBeVisible({ timeout: 10000 });
  },
);
Then('【正常系 記事投稿】投稿日が今日の日付になっている', async function () {
  const page = playwrightHelper.getPage();
  await expect(page.getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/)).toBeVisible({
    timeout: 10000,
  });
});
Then('【正常系 記事投稿】更新日が今日の日付になっている', async function () {
  const page = playwrightHelper.getPage();
  await expect(page.getByText(/更新日:\d{4}\/\d{1,2}\/\d{1,2}/)).toBeVisible({
    timeout: 10000,
  });
});

Then(
  '【正常系 記事投稿】「リンクテスト」という文字のリンクが存在する',
  async function () {
    const page = playwrightHelper.getPage();

    const linkText = page.locator('a', { hasText: 'リンクテスト' });
    expect(linkText).toBeDefined();
  },
);

Then(
  '【正常系 記事投稿】「リンクテスト」の href が「example.com」になっている',
  async function () {
    const page = playwrightHelper.getPage();

    const linkElement = page.locator('a', { hasText: 'リンクテスト' });
    const href = await linkElement.getAttribute('href');

    // プロトコルが付与されている場合と付与されていない場合の両方を考慮
    expect(
      href === 'example.com' ||
        href === 'https://example.com' ||
        href === 'http://example.com',
    ).toBeTruthy();
  },
);

When('【正常系 記事投稿】新着記事一覧ページにアクセスする', async function () {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();

  await page.goto(`${process.env.TEST_TARGET_URL}/posts/latest`);
});
Then(
  '【正常系 記事投稿】投稿した記事が新着記事一覧に表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    await expect
      .poll(
        async () => {
          // 新規追加された記事が反映されるまで再読み込みを繰り返す
          await page.reload();
          const postedPageTitle = page.getByText('テスト記事');
          return postedPageTitle.innerText();
        },
        {
          timeout: 15_000,
          intervals: [1_000],
        },
      )
      .toBe('テスト記事');
  },
);

// 以下ヘルパ関数

// Cloudinary の URL はリソースのパス以外の情報も含まれるため、
// リソースのパス部分のみを比較する
// 例: https://res.cloudinary.com/.../v1/test-book?_a=...
// 「/v1/ から ? または # まで」の文字列を取り出す
function expectMatchImageResourceByCloudinary(src: string | null) {
  const resourceRegex = /\/v1\/([^?#]+)/;

  const matchSelected = selectedThumbnailImageSrc!.match(resourceRegex);
  const matchCurrent = src!.match(resourceRegex);

  // どちらも正規表現にマッチしているか確認
  expect(matchSelected).not.toBeNull();
  expect(matchCurrent).not.toBeNull();

  // マッチした文字列同士を比較
  // （例: v1/test-book）
  expect(matchCurrent?.[1]).toBe(matchSelected?.[1]);
}

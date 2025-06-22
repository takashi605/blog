import { Given, Then, When } from '@cucumber/cucumber';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

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

    // 対応する画像をクリックし、src 属性を取得して変数に保持
    const labelsInModal = modal.locator('label');
    const firstLabelInModal = labelsInModal.first();
    await firstLabelInModal.click();
    selectedThumbnailImageSrc = await firstLabelInModal
      .locator('img')
      .getAttribute('src');
  },
);
Then(
  '【正常系 記事投稿】モーダルを閉じると、投稿画面内にサムネイル画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    const modal = page.getByRole('dialog');
    const closeButton = modal.getByRole('button', { name: '閉じる' });
    await closeButton.click();

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
    // テキストをセット
    await richTextEditor.pressSequentially('リンクテスト', { timeout: 10000 });
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
    name: 'URL(https:// から始まるもの)を入力してください。',
  });
  await expect(linkInput).toBeVisible({ timeout: 10000 });
});

When(
  '【正常系 記事投稿】リンク設定 input に「example.com」と入力する',
  async function () {
    const page = playwrightHelper.getPage();

    // リンク設定入力フィールドにURLを入力
    const linkInput = page.getByRole('textbox', {
      name: 'URL(https:// から始まるもの)を入力してください。',
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
    await richTextEditor.pressSequentially('見出し2');
    await selectByArrowLeft(page, richTextEditor, 4);
    const h2Button = page.getByRole('checkbox', { name: 'h2' });
    await h2Button.click();
    await clearSelectionByArrow(page, richTextEditor);
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
    richTextEditor.press('Enter');
    await richTextEditor.pressSequentially('見出し3');
    await selectByArrowLeft(page, richTextEditor, 4);
    const h2Button = page.getByRole('checkbox', { name: 'h3' });
    await h2Button.click();
    await clearSelectionByArrow(page, richTextEditor);
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
  '【正常系 記事投稿】「const a = 1」入力し、「code」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    richTextEditor.press('Enter');
    await richTextEditor.pressSequentially('const a = 1');
    const codeButton = page.getByRole('checkbox', { name: /^code$/ });
    await codeButton.click();
  },
);
Then(
  '【正常系 記事投稿】エディタ内にコードブロックが存在している',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]').filter({
      hasText: 'const a = 1',
    });

    // class 属性に language-js が含まれているかで判別
    const codeBlock = richTextEditor.locator('.language-js');
    await expect(codeBlock).toBeVisible({ timeout: 10000 });
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
    await richTextEditor.press('Enter');
    await richTextEditor.press('Enter');
    await richTextEditor.press('Enter');

    const openModalButton = page.getByRole('button', { name: '画像を挿入' });
    await openModalButton.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });

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

When('【正常系 記事投稿】「投稿」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const publishButton = page.getByRole('button', { name: '投稿' });
  await publishButton.click();
});
Then(
  '【正常系 記事投稿】記事が投稿され、投稿完了ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();

    await expect(page.getByText('記事を公開しました')).toBeVisible({
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
    await postedPageLink.click();
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
  '【正常系 記事投稿】コードブロック内に「const a = 1」が表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    const codeBlock = page.getByRole('code').filter({
      hasText: 'const a = 1',
    });
    await expect(codeBlock).toBeVisible({ timeout: 10000 });
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
    await expect(linkText).toBeVisible({ timeout: 10000 });
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
    selectedThumbnailImageSrc = await firstLabelInModal
      .locator('img')
      .getAttribute('src');

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

    await selectByArrowLeft(page, richTextEditor, 101);

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

// 以下ヘルパ関数
async function selectByArrowLeft(page: Page, locator: Locator, count: number) {
  await page.keyboard.down('Shift');
  for (let i = 1; i <= count; i++) {
    await locator.press('ArrowLeft');
  }
  await page.keyboard.up('Shift');
}
async function clearSelectionByArrow(page: Page, locator: Locator) {
  // Shiftキーが押されていないことを確実にしておく
  await page.keyboard.up('Shift');
  // 右矢印を1回押すだけで選択が外れる
  await locator.press('ArrowRight');
}
export const formatDate2DigitString = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return date.toLocaleDateString('ja-JP', options);
};

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

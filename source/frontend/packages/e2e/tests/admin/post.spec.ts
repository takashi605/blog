import { Before, Given, Then, When } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import { chromium, expect } from '@playwright/test';

let page: Page;

Before(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

Given('記事投稿ページにアクセスする', async () => {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  await page.goto(`${process.env.ADMIN_URL}/posts/create`);
});

When('リッチテキストエディタに「こんにちは！」と入力する', () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  richTextEditor.fill('こんにちは！');
});
Then('リッチテキストエディタに「こんにちは！」が表示される', async () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toHaveText('こんにちは！');
});
When('「世界」と入力し、その文字を選択して太字にする', async () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  // テキストをセット
  await richTextEditor.fill('こんにちは！世界');

  // カーソルは通常入力後に文末にあると想定
  // 「世界」を選択するため、カーソルを左へ移動して選択範囲を作る
  await richTextEditor.press('ArrowLeft');
  await richTextEditor.press('ArrowLeft');

  // Shift を押しながら右矢印で「世界」を選択
  await page.keyboard.down('Shift');
  await richTextEditor.press('ArrowRight');
  await richTextEditor.press('ArrowRight');
  await page.keyboard.up('Shift');

  // Ctrl+B で太字化コマンドを発動
  await richTextEditor.press('ControlOrMeta+b');
});
Then(
  'リッチテキストエディタに「こんにちは！世界」と表示され、世界のみ太字になっている',
  async () => {
    const richTextEditor = page.locator('[contenteditable="true"]');

    await expect(richTextEditor).toHaveText('こんにちは！世界');
    // 「世界」が strong タグで囲われているか確認
    const boldText = richTextEditor.locator('strong');
    await expect(boldText).toHaveText('世界');
  },
);
When('「見出し2」と入力し、その文字を選択して「h2」ボタンを押す',async() => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  await richTextEditor.fill('見出し2');
  await richTextEditor.press('ControlOrMeta+a');
  const h2Button = page.getByRole('button', { name: 'h2' });
  await h2Button.click();
})
Then('リッチテキストエディタに「見出し2」と表示され、レベル2見出しになっている',async() => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  const h2Text = richTextEditor.locator('h2');
  await expect(h2Text).toHaveText('見出し2');
})
When('「見出し3」と入力し、その文字を選択して「h3」ボタンを押す',async() => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  await richTextEditor.fill('見出し3');
  await richTextEditor.press('ControlOrMeta+a');
  const h3Button = page.getByRole('button', { name: 'h3' });
  await h3Button.click();
})
Then('リッチテキストエディタに「見出し3」と表示され、レベル3見出しになっている',async() => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  const h3Text = richTextEditor.locator('h3');
  await expect(h3Text).toHaveText('見出し3');
})

// When('記事タイトルのインプットに「タイトル」を入力する', async () => {
//   const titleInput = await page.getByRole('textbox', { name: 'タイトル' });
//   await titleInput.fill('タイトル');
//   await expect(titleInput).toHaveValue('タイトル');
// });

// When('「h2」ボタンを押す', async () => {
//   const addH2Button = await page.getByRole('button', { name: 'h2' });
//   await addH2Button.click();
// });
// Then('h2のインプットが表示される', async () => {
//   await expect(page.getByRole('textbox', { name: 'h2' })).toBeVisible();
// });
// When('h2に「見出しレベル2」と入力する', async () => {
//   const h2Input = await page.getByRole('textbox', { name: 'h2' });
//   await h2Input.fill('見出しレベル2');
//   await expect(h2Input).toHaveValue('見出しレベル2');
// });
// When('「paragraph」ボタンを押す', async () => {
//   const addTextButton = await page.getByRole('button', {
//     name: 'paragraph',
//   });
//   await addTextButton.click();
// });
// Then('paragraphのインプットが表示される', async () => {
//   await expect(page.getByRole('textbox', { name: 'paragraph' })).toBeVisible();
// });
// When('paragraphのインプットに「paragraph入力値」と入力する', async () => {
//   const paragraphInput = await page.getByRole('textbox', { name: 'paragraph' });
//   await paragraphInput.fill('paragraph入力値');
//   await expect(paragraphInput).toHaveValue('paragraph入力値');
// });
// When('「h3」ボタンを押す', async () => {
//   const addH3Button = await page.getByRole('button', { name: 'h3' });
//   await addH3Button.click();
// });
// Then('h3 のインプットが表示される', async () => {
//   await expect(page.getByRole('textbox', { name: 'h3' })).toBeVisible();
// });
// When('h3 のインプットに「見出しレベル3」と入力する', async () => {
//   const h3Input = await page.getByRole('textbox', { name: 'h3' });
//   await h3Input.fill('見出しレベル3');
//   await expect(h3Input).toHaveValue('見出しレベル3');
// });
// When('「公開」ボタンを押す', async () => {
//   const publishButton = page.getByRole('button', { name: '投稿' });
//   await publishButton.click();
// });
// Then('「記事を公開しました」と表示される', async () => {
//   await expect(page.getByText('記事を公開しました')).toBeVisible();
// });

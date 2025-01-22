import { Before, Given, Then, When } from '@cucumber/cucumber';
import type { Locator, Page } from '@playwright/test';
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

Then('リッチテキストエディタが表示されていることを確認する', async () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toBeVisible({ timeout: 10000 });
});

When('リッチテキストエディタに「こんにちは！」と入力する', async () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  await richTextEditor.pressSequentially('こんにちは！', { timeout: 10000 });
});
Then('リッチテキストエディタに「こんにちは！」が表示される', async () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toHaveText('こんにちは！', { timeout: 10000 });
});
When('「世界」と入力し、その文字を選択して太字ボタンを押す', async () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  // テキストをセット
  await richTextEditor.pressSequentially('世界', { timeout: 10000 });

  await selectByArrowLeft(richTextEditor, 2);

  // 太字ボタンを押す
  const boldButton = page.getByRole('button', { name: 'bold' });
  await boldButton.click();

  // 選択の解除
  await clearSelectionByArrow(richTextEditor);
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
When('「世界」を再び選択し、太字ボタンを押す', async () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  await selectByArrowLeft(richTextEditor, 2);

  const boldButton = page.getByRole('button', { name: 'bold' });
  await boldButton.click();
  await clearSelectionByArrow(richTextEditor);
});
Then(
  'リッチテキストエディタに「こんにちは！世界」と表示され、世界の太字が解除されている',
  async () => {
    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toHaveText('こんにちは！世界');
    // 「世界」が strong タグで囲われていないか確認
    const boldText = richTextEditor.locator('strong');
    await expect(boldText).not.toBeVisible({ timeout: 10000 });
  },
);
When('「見出し2」と入力し、その文字を選択して「h2」ボタンを押す', async () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  richTextEditor.press('Enter');
  await richTextEditor.pressSequentially('見出し2');
  await selectByArrowLeft(richTextEditor, 4);
  const h2Button = page.getByRole('button', { name: 'h2' });
  await h2Button.click();
  await clearSelectionByArrow(richTextEditor);
});
Then(
  'リッチテキストエディタに「見出し2」と表示され、レベル2見出しになっている',
  async () => {
    const richTextEditor = page.locator('[contenteditable="true"]');
    const h2Text = richTextEditor.locator('h2');
    await expect(h2Text).toHaveText('見出し2');
  },
);
When('「見出し3」と入力し、その文字を選択して「h3」ボタンを押す', async () => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  richTextEditor.press('Enter');
  await richTextEditor.pressSequentially('見出し3');
  await selectByArrowLeft(richTextEditor, 4);
  const h2Button = page.getByRole('button', { name: 'h3' });
  await h2Button.click();
  await clearSelectionByArrow(richTextEditor);
});
Then(
  'リッチテキストエディタに「見出し3」と表示され、レベル3見出しになっている',
  async () => {
    const richTextEditor = page.locator('[contenteditable="true"]');
    const h3Text = richTextEditor.locator('h3');
    await expect(h3Text).toHaveText('見出し3');
  },
);
When('「投稿」ボタンを押す', async () => {
  const publishButton = page.getByRole('button', { name: '投稿' });
  await publishButton.click();
});
Then('記事が投稿され、投稿完了ページに遷移する', async () => {
  await expect(page.getByText('記事を公開しました')).toBeVisible({
    timeout: 10000,
  });
});

// 以下ヘルパ関数
async function selectByArrowLeft(locator: Locator, count: number) {
  await page.keyboard.down('Shift');
  for (let i = 1; i <= count; i++) {
    await locator.press('ArrowLeft');
  }
  await page.keyboard.up('Shift');
}
async function clearSelectionByArrow(locator: Locator) {
  // Shiftキーが押されていないことを確実にしておく
  await page.keyboard.up('Shift');
  // 右矢印を1回押すだけで選択が外れる
  await locator.press('ArrowRight');
}

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
//   await expect(page.getByRole('textbox', { name: 'h2' })).toBeVisible({timeout: 10000});
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
//   await expect(page.getByRole('textbox', { name: 'paragraph' })).toBeVisible({timeout: 10000});
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
//   await expect(page.getByRole('textbox', { name: 'h3' })).toBeVisible({timeout: 10000});
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
//   await expect(page.getByText('記事を公開しました')).toBeVisible({timeout: 10000});
// });

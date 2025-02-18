import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { createBdd } from 'playwright-bdd';
const { Given, When, Then } = createBdd();

Given('記事投稿ページにアクセスする', async function ({ page }) {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }

  await page.goto(`${process.env.ADMIN_URL}/posts/create`);
});

Then(
  'リッチテキストエディタが表示されていることを確認する',
  async function ({ page }) {
    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toBeVisible({ timeout: 20000 });
  },
);

When(
  'リッチテキストエディタに「こんにちは！」と入力する',
  async function ({ page }) {
    const richTextEditor = page.locator('[contenteditable="true"]');
    await richTextEditor.pressSequentially('こんにちは！', { timeout: 20000 });
  },
);
Then(
  'リッチテキストエディタに「こんにちは！」が表示される',
  async function ({ page }) {
    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toHaveText('こんにちは！', { timeout: 20000 });
  },
);
When(
  '「こんにちは！」の文字列を選択して太字ボタンを押す',
  async function ({ page }) {
    const locator = page.locator('text=こんにちは！');
    await locator.selectText({ timeout: 20000 });

    // 太字ボタンをクリック
    // const boldButton = page.getByRole('button', { name: 'bold' });
    // await boldButton.click();

    // キーボード操作で太字にする
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyB');
    await page.keyboard.up('Control');
  },
);
Then('「こんにちは！」が太字になっている', async function ({ page }) {
  // ページの状態を出力
  console.log(await page.content());
  const richTextEditor = page.locator('[contenteditable="true"]');
  const boldText = richTextEditor.locator('b, strong');

  await expect(boldText).toHaveText('こんにちは！', { timeout: 20000 });
});
When(
  '「こんにちは！」を再び選択し、太字ボタンを押す',
  async function ({ page }) {
    const locator = page.locator('text=こんにちは！');
    await locator.selectText({ timeout: 20000 });

    const boldButton = page.getByRole('button', { name: 'bold' });
    await boldButton.click();
    await clearSelection(page);
  },
);
Then('「こんにちは！」の太字が解除されている', async function ({ page }) {
  const richTextEditor = page.locator('[contenteditable="true"]');
  const boldText = richTextEditor.locator('b, strong');

  await expect(boldText).not.toBeVisible({ timeout: 20000 });
});
When(
  '「見出し2」と入力し、その文字を選択して「h2」ボタンを押す',
  async function ({ page }) {
    const richTextEditor = page.locator('[contenteditable="true"]');

    richTextEditor.press('Enter');

    await richTextEditor.pressSequentially('見出し2');
    const h2Locator = page.locator('text=見出し2');
    await h2Locator.selectText({ timeout: 20000 });

    const h2Button = page.getByRole('button', { name: 'h2' });
    await h2Button.click();

    await clearSelection(page);
  },
);
Then(
  'リッチテキストエディタに「見出し2」と表示され、レベル2見出しになっている',
  async function ({ page }) {
    const richTextEditor = page.locator('[contenteditable="true"]');
    const h2Text = richTextEditor.locator('h2');
    await expect(h2Text).toHaveText('見出し2', { timeout: 20000 });
  },
);
When(
  '「見出し3」と入力し、その文字を選択して「h3」ボタンを押す',
  async function ({ page }) {
    const richTextEditor = page.locator('[contenteditable="true"]');

    richTextEditor.press('Enter');

    await richTextEditor.pressSequentially('見出し3');
    const h3Locator = page.locator('text=見出し3');
    await h3Locator.selectText({ timeout: 20000 });

    const h2Button = page.getByRole('button', { name: 'h3' });
    await h2Button.click();

    await clearSelection(page);
  },
);
Then(
  'リッチテキストエディタに「見出し3」と表示され、レベル3見出しになっている',
  async function ({ page }) {
    const richTextEditor = page.locator('[contenteditable="true"]');
    const h3Text = richTextEditor.locator('h3');
    await expect(h3Text).toHaveText('見出し3', { timeout: 20000 });
  },
);

// 以下ヘルパ関数
async function clearSelection(page: Page) {
  await page.evaluate(() => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  });
}

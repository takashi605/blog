import { Given, Then, When } from '@cucumber/cucumber';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

Given('記事投稿ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/posts/create`);
});

Then('リッチテキストエディタが表示されていることを確認する', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toBeVisible({ timeout: 20000 });
});

When('リッチテキストエディタに「こんにちは！」と入力する', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  await richTextEditor.pressSequentially('こんにちは！', { timeout: 20000 });
});
Then('リッチテキストエディタに「こんにちは！」が表示される', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toHaveText('こんにちは！', { timeout: 20000 });
});
When('「こんにちは！」の文字列を選択して太字ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const locator = page.locator('text=こんにちは！');
  await selectTextInLocator(page, locator);

  // 太字ボタンをクリック
  const boldButton = page.getByRole('button', { name: 'bold' });
  await boldButton.click();
  await clearSelection(page);
  const html = await page.content();
  console.log(html);
});
Then('「こんにちは！」が太字になっている', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');
  const boldText = richTextEditor.locator('strong');

  await expect(boldText).toHaveText('こんにちは！', { timeout: 20000 });
});
When('「こんにちは！」を再び選択し、太字ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const locator = page.locator('text=こんにちは！');
  await selectTextInLocator(page, locator);

  const boldButton = page.getByRole('button', { name: 'bold' });
  await boldButton.click();
  await clearSelection(page);
});
Then('「こんにちは！」の太字が解除されている', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');
  const boldText = richTextEditor.locator('strong');

  await expect(boldText).not.toBeVisible({ timeout: 20000 });
});
When(
  '「見出し2」と入力し、その文字を選択して「h2」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const richTextEditor = page.locator('[contenteditable="true"]');

    richTextEditor.press('Enter');

    await richTextEditor.pressSequentially('見出し2');
    const h2Locator = page.locator('text=見出し2');
    await selectTextInLocator(page, h2Locator);

    const h2Button = page.getByRole('button', { name: 'h2' });
    await h2Button.click();

    await clearSelection(page);
  },
);
Then(
  'リッチテキストエディタに「見出し2」と表示され、レベル2見出しになっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    const h2Text = richTextEditor.locator('h2');
    await expect(h2Text).toHaveText('見出し2', { timeout: 20000 });
  },
);
When(
  '「見出し3」と入力し、その文字を選択して「h3」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const richTextEditor = page.locator('[contenteditable="true"]');

    richTextEditor.press('Enter');

    await richTextEditor.pressSequentially('見出し3');
    const h3Locator = page.locator('text=見出し3');
    await selectTextInLocator(page, h3Locator);

    const h2Button = page.getByRole('button', { name: 'h3' });
    await h2Button.click();

    await clearSelection(page);
  },
);
Then(
  'リッチテキストエディタに「見出し3」と表示され、レベル3見出しになっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    const h3Text = richTextEditor.locator('h3');
    await expect(h3Text).toHaveText('見出し3', { timeout: 20000 });
  },
);
When('「投稿」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const publishButton = page.getByRole('button', { name: '投稿' });
  await publishButton.click();
});
Then('記事が投稿され、投稿完了ページに遷移する', async function () {
  const page = playwrightHelper.getPage();

  await expect(page.getByText('記事を公開しました')).toBeVisible({
    timeout: 20000,
  });
});

// 以下ヘルパ関数
async function selectTextInLocator(page: Page, locator: Locator) {
  // バウンディングボックスを取得
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('「世界」のバウンディングボックスを取得できませんでした');
  }

  const startX = box.x + box.width;
  const startY = box.y + box.height / 2;

  // マウスを移動して押し下げ (ドラッグ開始)
  await page.mouse.move(startX, startY);
  await page.mouse.down();

  // 端 (または少しずらした位置) に向かってマウスを移動して選択範囲を作る
  // ここでは例として要素左端に移動。steps を増やすとドラッグが滑らかになる
  await page.mouse.move(box.x, startY, { steps: 10 });
  await page.mouse.up();
}
async function clearSelection(page: Page) {
  await page.evaluate(() => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  });
}

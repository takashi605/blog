import { Given, Then, When } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
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
  await locator.selectText({ timeout: 20000 });

  const selectedText = await page.evaluate(() => {
    const selection = window.getSelection();
    return selection ? selection.toString() : '';
  });

  console.log(selectedText);

  // 選択文字列が「世界」になっていることをアサート
  expect(selectedText).toBe('こんにちは！');

  page.on('console', msg => {
    console.log(msg.text());
   })
  // 太字ボタンをクリック
  // const boldButton = page.getByRole('button', { name: 'bold' });
  // 取得したボタンを確認
  // console.log(await boldButton.innerHTML());
  // await boldButton.click();

  // キーボード操作で太字にする
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyB');
  await page.keyboard.up('Control');

  await page.waitForFunction(
    () => {
      const editor = document.querySelector('[contenteditable="true"]');
      const strongTag = editor?.querySelector('strong');
      return strongTag && strongTag.textContent?.includes('こんにちは！');
    },
    { timeout: 20000 },
  );
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
  await locator.selectText({ timeout: 20000 });

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
    await h2Locator.selectText({ timeout: 20000 });

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
    await h3Locator.selectText({ timeout: 20000 });

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

// 以下ヘルパ関数
async function clearSelection(page: Page) {
  await page.evaluate(() => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  });
}

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
When('「世界」と入力し、その文字を選択して太字ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  // テキストをセット
  await richTextEditor.pressSequentially('世界', { timeout: 20000 });

  await selectByArrowLeft(page, richTextEditor, 2);

  // 太字ボタンを押す
  const boldButton = page.getByRole('button', { name: 'bold' });
  await boldButton.click();

  // 選択の解除
  await clearSelectionByArrow(page, richTextEditor);
  const html = await page.content();
  console.log(html);
});
Then(
  'リッチテキストエディタに「こんにちは！世界」と表示される',
  async function () {
    const page = playwrightHelper.getPage();
    const richTextEditor = page.locator('[contenteditable="true"]');

    await expect(richTextEditor).toHaveText('こんにちは！世界', {
      timeout: 20000,
    });
  },
);
Then('世界のみ太字になっている', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');
  const boldText = richTextEditor.locator('strong');

  await expect(boldText).toHaveText('世界', { timeout: 20000 });
});
When('「世界」を再び選択し、太字ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  await selectByArrowLeft(page, richTextEditor, 2);

  const boldButton = page.getByRole('button', { name: 'bold' });
  await boldButton.click();
  await clearSelectionByArrow(page, richTextEditor);
});
Then('世界の太字が解除されている', async function () {
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
    await selectByArrowLeft(page, richTextEditor, 4);

    const h2Button = page.getByRole('button', { name: 'h2' });
    await h2Button.click();

    await clearSelectionByArrow(page, richTextEditor);
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
    await selectByArrowLeft(page, richTextEditor, 4);

    const h2Button = page.getByRole('button', { name: 'h3' });
    await h2Button.click();


    await clearSelectionByArrow(page, richTextEditor);
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
async function selectByArrowLeft(page: Page, locator: Locator, count: number) {
  await page.keyboard.down('Shift');
  for (let i = 1; i <= count; i++) {
    await locator.press('ArrowLeft');
  }
  await page.waitForTimeout(300);
  await page.keyboard.up('Shift');
}
async function clearSelectionByArrow(page: Page, locator: Locator) {
  // Shiftキーが押されていないことを確実にしておく
  await page.keyboard.up('Shift');
  // 右矢印を1回押すだけで選択が外れる
  await locator.press('ArrowRight');
  await page.waitForTimeout(300);
}

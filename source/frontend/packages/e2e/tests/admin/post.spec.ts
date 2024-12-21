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

When('記事タイトルのインプットに「タイトル」を入力する', async () => {
  const titleInput = await page.getByRole('textbox', { name: 'タイトル' });
  await titleInput.fill('タイトル');
  await expect(titleInput).toHaveValue('タイトル');
});

When('「h2」ボタンを押す', async () => {
  const addH2Button = await page.getByRole('button', { name: 'h2' });
  await addH2Button.click();
});
Then('h2のインプットが表示される', async () => {
  await expect(page.getByRole('textbox', { name: 'h2' })).toBeVisible();
});
When('h2に「見出しレベル2」と入力する', async () => {
  const h2Input = await page.getByRole('textbox', { name: 'h2' });
  await h2Input.fill('見出しレベル2');
  await expect(h2Input).toHaveValue('見出しレベル2');
});
When('「paragraph」ボタンを押す', async () => {
  const addTextButton = await page.getByRole('button', {
    name: 'paragraph',
  });
  await addTextButton.click();
});
Then('paragraphのインプットが表示される', async () => {
  await expect(page.getByRole('textbox', { name: 'paragraph' })).toBeVisible();
});
When('paragraphのインプットに「paragraph入力値」と入力する', async () => {
  const paragraphInput = await page.getByRole('textbox', { name: 'paragraph' });
  await paragraphInput.fill('paragraph入力値');
  await expect(paragraphInput).toHaveValue('paragraph入力値');
});
When('「h3」ボタンを押す', async () => {
  const addH3Button = await page.getByRole('button', { name: 'h3' });
  await addH3Button.click();
});
Then('h3 のインプットが表示される', async () => {
  await expect(page.getByRole('textbox', { name: 'h3' })).toBeVisible();
});
When('h3 のインプットに「見出しレベル3」と入力する', async () => {
  const h3Input = await page.getByRole('textbox', { name: 'h3' });
  await h3Input.fill('見出しレベル3');
  await expect(h3Input).toHaveValue('見出しレベル3');
});
When('リッチテキストエディタに「こんにちは！」と入力する',() => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  richTextEditor.fill('こんにちは！');
})
Then('リッチテキストエディタに「こんにちは！」が表示される',() => {
  const richTextEditor = page.locator('[contenteditable="true"]');
  expect(richTextEditor).toHaveText('こんにちは！');
})
When('「公開」ボタンを押す', async () => {
  const publishButton = page.getByRole('button', { name: '投稿' });
  await publishButton.click();
});
Then('「記事を公開しました」と表示される', async () => {
  await expect(page.getByText('記事を公開しました')).toBeVisible();
});

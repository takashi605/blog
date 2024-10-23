import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('記事投稿ページにアクセスする', async ({ page }) => {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  await page.goto(`${process.env.ADMIN_URL}/posts/create`);
});

When('記事タイトルのインプットに「タイトル」を入力する', async ({ page }) => {
  const titleInput = await page.getByRole('textbox', { name: 'title' });
  await titleInput.fill('タイトル');
  await expect(titleInput).toHaveValue('タイトル');
});

When('「h2」ボタンを押す', async ({ page }) => {
  const addH2Button = await page.getByRole('button', { name: 'h2' });
  await addH2Button.click();
});
Then('h2のインプットが表示される', async ({ page }) => {
  await expect(page.getByRole('textbox', { name: 'h2' })).toBeVisible();
});
When('h2に「見出しレベル2」と入力する', async ({ page }) => {
  const h2Input = await page.getByRole('textbox', { name: 'h2' });
  await h2Input.fill('見出しレベル2');
  await expect(h2Input).toHaveValue('見出しレベル2');
});
When('「テキスト」ボタンを押す', async ({ page }) => {
  const addTextButton = await page.getByRole('button', { name: 'text' });
  await addTextButton.click();
});
Then('テキストのインプットが表示される', async ({ page }) => {
  await expect(page.getByRole('textbox', { name: 'text' })).toBeVisible();
});
When('テキストのインプットに「テキスト入力値」と入力する', async ({ page }) => {
  const textInput = await page.getByRole('textbox', { name: 'text' });
  await textInput.fill('テキスト入力値');
  await expect(textInput).toHaveValue('テキスト入力値');
});
When('「h3」ボタンを押す', async ({ page }) => {
  const addH3Button = await page.getByRole('button', { name: 'h3' });
  await addH3Button.click();
});
Then('h3 のインプットが表示される', async ({ page }) => {
  await expect(page.getByRole('textbox', { name: 'h3' })).toBeVisible();
});
When('h3 のインプットに「見出しレベル3」と入力する', async ({ page }) => {
  const h3Input = await page.getByRole('textbox', { name: 'h3' });
  await h3Input.fill('見出しレベル3');
  await expect(h3Input).toHaveValue('見出しレベル3');
});
When('公開ボタンを押す', async ({ page }) => {
  const publishButton = await page.getByRole('button', { name: 'publish' });
  await publishButton.click();
});
Then('「記事を公開しました」と表示される', async ({ page }) => {
  await expect(page.getByText('記事を公開しました')).toBeVisible();
});

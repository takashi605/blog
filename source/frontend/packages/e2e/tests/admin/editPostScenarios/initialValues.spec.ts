/**
 * 記事編集初期値E2Eテストステップ定義
 */

import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../../support/playwrightHelper.js';

const testPostId = '672f2772-72b5-404a-8895-b1fbbf310801'; // テストデータの記事ID

Given('【正常系 記事編集 初期値】記事編集ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/posts/${testPostId}/edit`, { timeout: 20000 });
});

Then('【正常系 記事編集 初期値】リッチテキストエディタが表示されている', async function () {
  const page = playwrightHelper.getPage();
  
  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toBeVisible({ timeout: 10000 });
});

Then('【正常系 記事編集 初期値】公開日が現在設定中のものになっている', async function () {
  const page = playwrightHelper.getPage();
  
  const publishedDateInput = page.getByRole('combobox', { name: '公開日' });
  await expect(publishedDateInput).toHaveValue('2021-01-01');
});

Then('【正常系 記事編集 初期値】タイトルが現在設定中のものになっている', async function () {
  const page = playwrightHelper.getPage();
  
  const titleInput = page.getByRole('textbox', { name: 'タイトル' });
  await expect(titleInput).toHaveValue('初めての技術スタックへの挑戦');
});

Then('【正常系 記事編集 初期値】サムネイルが現在設定中のものになっている', async function () {
  const page = playwrightHelper.getPage();
  
  // サムネイル画像が表示されていることを確認
  const thumbnailImage = page.getByRole('img', { name: 'サムネイル画像' });
  await expect(thumbnailImage).toBeVisible();
  
  // 画像のsrc属性からtest-coffeeリソースが含まれていることを確認
  const src = await thumbnailImage.getAttribute('src');
  expect(src).toContain('test-coffee');
});

Then('【正常系 記事編集 初期値】コンテンツが現在設定中のものになっている', async function () {
  const page = playwrightHelper.getPage();
  
  const editorContent = page.locator('[contenteditable="true"]');
  
  // 最初の段落の内容を確認
  await expect(editorContent).toContainText('新しい技術スタックに挑戦することは、いつも冒険と学びの場です。');
  
  // h2見出しの内容を確認  
  await expect(editorContent.locator('h2')).toContainText('最初のステップ');
  
  // h3見出しの内容を確認
  await expect(editorContent.locator('h3')).toContainText('学習環境の準備');
  
  // 太字スタイルのテキストを確認
  await expect(editorContent.locator('strong')).toContainText('繰り返しの実践が技術力を向上させる鍵です。');
  
  // インラインコードスタイルのテキストを確認
  await expect(editorContent.locator('code')).toContainText('新しいコードを試し、デバッグしながら学ぶことで、単なる理論以上の実践的なスキルを身に付けることができます。');
  
  // リンクテキストを確認
  await expect(editorContent.locator('a')).toContainText('試行錯誤は技術習得において欠かせないプロセスです。');
  
  // リンクのhref属性を確認
  const linkElement = editorContent.locator('a');
  const href = await linkElement.getAttribute('href');
  expect(href).toBe('https://example.com');
  
  // 画像が表示されていることを確認
  const imageInEditor = editorContent.locator('img');
  await expect(imageInEditor).toBeVisible();
  
  // 画像のsrc属性からtest-bookリソースが含まれていることを確認
  const imageSrc = await imageInEditor.getAttribute('src');
  expect(imageSrc).toContain('test-book');
});
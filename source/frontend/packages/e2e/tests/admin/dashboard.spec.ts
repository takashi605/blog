import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

Given('【ダッシュボード リンク】管理者ダッシュボードページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/`, { timeout: 20000 });
});

When('【ダッシュボード リンク】ダッシュボード内の「記事管理」リンクをクリックする', async function () {
  const page = playwrightHelper.getPage();
  const link = page.getByRole('link', { name: '記事管理' });
  await link.click();
});

Then('【ダッシュボード リンク】記事管理ページに遷移する', async function () {
  const page = playwrightHelper.getPage();
  await expect(page).toHaveURL(/.*\/posts$/, { timeout: 10000 });
});

When('【ダッシュボード リンク】記事管理ページ内の「ダッシュボードに戻る」リンクをクリックする', async function () {
  const page = playwrightHelper.getPage();
  const link = page.getByRole('link', { name: 'ダッシュボードに戻る' });
  await link.click();
});

Then('【ダッシュボード リンク】記事管理ページからダッシュボードページに遷移する', async function () {
  const page = playwrightHelper.getPage();
  await expect(page).toHaveURL(/.*\/$/, { timeout: 10000 });
});

When('【ダッシュボード リンク】ダッシュボード内の「画像管理」リンクをクリックする', async function () {
  const page = playwrightHelper.getPage();
  const link = page.getByRole('link', { name: '画像管理' });
  await link.click();
});

Then('【ダッシュボード リンク】画像管理ページに遷移する', async function () {
  const page = playwrightHelper.getPage();
  await expect(page).toHaveURL(/.*\/images$/, { timeout: 10000 });
});

When('【ダッシュボード リンク】画像管理ページ内の「ダッシュボードに戻る」リンクをクリックする', async function () {
  const page = playwrightHelper.getPage();
  const link = page.getByRole('link', { name: 'ダッシュボードに戻る' });
  await link.click();
});

Then('【ダッシュボード リンク】画像管理ページからダッシュボードページに遷移する', async function () {
  const page = playwrightHelper.getPage();
  await expect(page).toHaveURL(/.*\/$/, { timeout: 10000 });
});
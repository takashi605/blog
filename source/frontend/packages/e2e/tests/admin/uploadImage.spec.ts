import { Given, Then, When } from '@cucumber/cucumber';
import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import playwrightHelper from '../../support/playwrightHelper.ts';

Given('画像管理ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/images`);
});
When('「画像を追加」ボタンを押下する', async function () {
  const page = playwrightHelper.getPage();
  const openModalButton = page.getByRole('button', { name: '画像を追加' });
  await openModalButton.click();
});
Then('画像アップロードモーダルが表示される', async function () {
  const modal = getModal();

  await expect(modal).toBeVisible({ timeout: 10000 });
});
Then(
  'モーダル内に「画像名」「パス」の入力欄が表示されている',
  async function () {
    const nameInput = getImageNameInput();
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    const pathInput = getImagePathInput();
    await expect(pathInput).toBeVisible({ timeout: 10000 });
  },
);
When('画像を選択する', async function () {
  // 参考：https://playwright.dev/docs/api/class-filechooser
  const page = playwrightHelper.getPage();
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByText('ファイルを選択').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(dirname(), 'images/camera.jpg'));
});
When('画像名を入力する', async function () {
  const nameInput = getImageNameInput();
  await nameInput.fill('test-image');
});
When('パスを入力する', async function () {
  const pathInput = getImagePathInput();
  await pathInput.fill('https://example.com/test-image.jpg');
});
When('モーダル内の「追加」ボタンを押下する', async function () {
  const modal = getModal();
  const addButton = modal.getByRole('button', { name: '追加' });
  await addButton.click();
});
Then('「画像を追加しました」というメッセージが表示される', async function () {
  const page = playwrightHelper.getPage();
  const message = page.getByText('画像を追加しました');
  await expect(message).toBeVisible({ timeout: 10000 });
});

// 以下ヘルパ関数
function getModal(): Locator {
  const page = playwrightHelper.getPage();
  const modal = page.getByRole('dialog');
  return modal;
}

function getImageNameInput(): Locator {
  const modal = getModal();
  const nameInput = modal.getByRole('textbox', { name: '画像名' });
  return nameInput;
}

function getImagePathInput(): Locator {
  const modal = getModal();
  const pathInput = modal.getByRole('textbox', { name: 'パス' });
  return pathInput;
}

function dirname() {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
}

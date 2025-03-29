import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

let initialPickUpPostsTitle: string[] = [];
let updatedPickUpPostsTitle: string[] = [];

Given('ピックアップ記事選択ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/posts/pickup`);
});
Then(
  '現在ピックアップ記事に設定されている記事のタイトルが3件分表示されている',
  async function () {
    // ピックアップの一覧表示セクションを取得
    const pickupPostsSection = new PickUpPostsSection().getLocator();
    // セクション内の記事タイトルを取得
    const postTitles = pickupPostsSection.locator('h3');
    // セクション内の記事タイトルが3件であることを確認
    expect(await postTitles.count()).toBe(3);
  },
);

When('「ピックアップ記事を選択」ボタンを押下する', async function () {
  const { getOpenModalButton } = new SelectPickUpPostsModal();
  await getOpenModalButton().click();
});
Then('ピックアップ記事選択モーダルが表示される', async function () {
  const modal = new SelectPickUpPostsModal().getLocator();
  await expect(modal).toBeVisible({ timeout: 10000 });
});
Then('既存の記事すべてのタイトルが表示される', async function () {
  const modal = new SelectPickUpPostsModal().getLocator();
  const postTitles = modal.locator('h3');
  expect(await postTitles.count()).toBeGreaterThan(0);

  initialPickUpPostsTitle = await postTitles.allInnerTexts();
});

When(
  'デフォルトで設定されているものとは違う組み合わせで3件の記事を選択して「保存」ボタンを押す',
  async function () {
    const { selectFirstThreePostTitles, getSaveButton } =
      new SelectPickUpPostsModal();
    const selectedPostTitles = await selectFirstThreePostTitles();
    updatedPickUpPostsTitle = selectedPostTitles;

    // 選択した記事がデフォルトのピックアップ記事と異なることを確認
    expect(selectedPostTitles).not.toEqual(initialPickUpPostsTitle);

    await getSaveButton().click();
  },
);
Then('モーダル内に保存した旨のメッセージが表示される', async function () {
  const modal = new SelectPickUpPostsModal().getLocator();
  const message = modal.getByText('ピックアップ記事を保存しました');
  await expect(message).toBeVisible({ timeout: 10000 });
});

When('モーダルを閉じる', async function () {
  const { getCloseModalButton } = new SelectPickUpPostsModal();
  await getCloseModalButton().click();
});
Then(
  '一覧表示されていたタイトルが新しいものに更新されている',
  async function () {
    const pickupPostsSection = new PickUpPostsSection().getLocator();
    const postTitles = pickupPostsSection.locator('h3');
    const updatedPostTitles = await postTitles.allInnerTexts();
    expect(updatedPostTitles).not.toEqual(initialPickUpPostsTitle);
  },
);

When('トップページへ遷移する', async function () {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();

  await page.goto(`${process.env.TEST_TARGET_URL}`);
});
Then(
  'ピックアップ記事のセクションに新規設定したピックアップ記事が表示されている',
  async function () {
    const pickupPostsSection = new HomePage().getPickUpSection();
    const postTitles = pickupPostsSection.locator('h3');
    const updatedPostTitles = await postTitles.allInnerTexts();
    expect(updatedPostTitles).toEqual(updatedPickUpPostsTitle);
  },
);

// ヘルパークラス
class PickUpPostsSection {
  getLocator() {
    const page = playwrightHelper.getPage();
    const sectionTitle = page.getByText('現在のピックアップ記事');
    return page.locator('section', { has: sectionTitle });
  }
}

class SelectPickUpPostsModal {
  getLocator() {
    const page = playwrightHelper.getPage();
    return page.getByRole('dialog');
  }
  getOpenModalButton() {
    const page = playwrightHelper.getPage();
    return page.getByRole('button', { name: 'ピックアップ記事を選択' });
  }
  getSaveButton() {
    const modal = this.getLocator();
    return modal.getByRole('button', { name: '保存' });
  }
  getCloseModalButton() {
    const modal = this.getLocator();
    return modal.getByRole('button', { name: '閉じる' });
  }

  async selectFirstThreePostTitles() {
    const modal = this.getLocator();
    const postTitles = modal.locator('h3');
    const firstPostTitle = postTitles.first();
    await firstPostTitle.click();
    const secondPostTitle = postTitles.nth(1);
    await secondPostTitle.click();
    const thirdPostTitle = postTitles.nth(2);
    await thirdPostTitle.click();

    const selectedPostTitles = await modal
      .locator('h3[aria-selected="true"]')
      .allInnerTexts();
    return selectedPostTitles;
  }
}

class HomePage {
  getPickUpSection() {
    const page = playwrightHelper.getPage();
    const pickUpSectionTitle = page.locator('h2', { hasText: '注目記事' });
    return page.locator('section', { has: pickUpSectionTitle });
  }
}

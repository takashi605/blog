import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

let initialPickUpPostTitles: string[] = [];
let updatedPickUpPostTitles: string[] = [];

Given(
  '【ピックアップ記事選択】ピックアップ記事選択ページにアクセスする',
  async function () {
    if (!process.env.ADMIN_URL) {
      throw new Error('ADMIN_URL 環境変数が設定されていません');
    }
    const page = playwrightHelper.getPage();

    const [response] = await Promise.all([
      page.waitForResponse('**/blog/posts/pickup*'),
      page.goto(`${process.env.ADMIN_URL}/posts/pickup`),
    ]);

    expect(response.status()).toBe(200);
    await response.json();
  },
);
Then(
  '【ピックアップ記事選択】現在ピックアップ記事に設定されている記事のタイトルが3件分表示されている',
  async function () {
    // ピックアップの一覧表示セクションを取得
    const pickupPostsSection = new PickUpPostsSection().getLocator();
    // セクション内の記事タイトルを取得
    const postTitles = pickupPostsSection.locator('h3');
    // セクション内の記事タイトルが3件であることを確認
    expect(await postTitles.count()).toBe(3);
  },
);

When(
  '【ピックアップ記事選択】「ピックアップ記事を選択」ボタンを押下する',
  async function () {
    const { getOpenModalButton } = new SelectPickUpPostsModal();
    const page = playwrightHelper.getPage();

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes('/blog/posts/latest') && resp.status() === 200,
      ),
      getOpenModalButton().click(),
    ]);

    expect(response.status()).toBe(200);

    // これをしないとレスポンスが返るまで待てていない気がする
    // 単純に処理に時間をかけているからたまたま上手くいくだけかもしれない
    // 一応、ChatGPT に聞いたら「レスポンスを読み込み終えるまで待機する有効な方法」とのことだった
    await response.json();
  },
);
Then(
  '【ピックアップ記事選択】ピックアップ記事選択モーダルが表示される',
  async function () {
    const modal = new SelectPickUpPostsModal().getLocator();
    await expect(modal).toBeVisible({ timeout: 10000 });
  },
);
Then(
  '【ピックアップ記事選択】既存の記事すべてのタイトルが表示される',
  async function () {
    const modal = new SelectPickUpPostsModal().getLocator();
    const postTitles = modal.locator('h3');

    expect(await postTitles.count()).toBeGreaterThan(0);
  },
);
Then(
  '【ピックアップ記事選択】デフォルトで3件の記事が選択されている',
  async function () {
    const modal = new SelectPickUpPostsModal();
    const selectedPostTitles = await modal.getSelectedPostTitles();
    initialPickUpPostTitles = selectedPostTitles;
    expect(selectedPostTitles.length).toBe(3);
  },
);

When(
  '【ピックアップ記事選択】デフォルトで設定されているものとは違う組み合わせで3件の記事を選択して「保存」ボタンを押す',
  async function () {
    const modal = new SelectPickUpPostsModal();
    await modal.uncheckAllPosts();
    const selectedPostTitles = await modal.selectFirstThreePostTitles();
    updatedPickUpPostTitles = selectedPostTitles;

    // 選択した記事がデフォルトのピックアップ記事と異なることを確認
    expect(selectedPostTitles).not.toEqual(initialPickUpPostTitles);

    modal.getSaveButton().click();
  },
);
Then(
  '【ピックアップ記事選択】モーダル内に保存した旨のメッセージが表示される',
  async function () {
    const modal = new SelectPickUpPostsModal().getLocator();
    const message = modal.getByText('ピックアップ記事を更新しました。');
    await expect(message).toBeVisible({ timeout: 10000 });
  },
);

When('【ピックアップ記事選択】モーダルを閉じる', async function () {
  const closeButton = new SelectPickUpPostsModal().getCloseModalButton();
  await closeButton.click();
});
Then(
  '【ピックアップ記事選択】一覧表示されていたタイトルが新しいものに更新されている',
  async function () {
    const pickupPostsSection = new PickUpPostsSection().getLocator();
    const postTitles = pickupPostsSection.locator('h3');
    const updatedPostTitles = await postTitles.allInnerTexts();
    expect(updatedPostTitles).not.toEqual(initialPickUpPostTitles);
  },
);

When('【ピックアップ記事選択】トップページへ遷移する', async function () {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }

  // 2秒の revalidate を待つ
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // トップページに遷移
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.TEST_TARGET_URL}`);
});
Then(
  '【ピックアップ記事選択】ピックアップ記事のセクションに新規設定したピックアップ記事が表示されている',
  async function () {
    const pickupPostsSection = new HomePage().getPickUpSection();
    const postTitles = pickupPostsSection.locator('h3');
    const updatedPostTitles = await postTitles.allInnerTexts();
    // 順不同で、かつ、配列の要素が同じであることを確認
    expect(updatedPostTitles).toEqual(
      expect.arrayContaining(updatedPickUpPostTitles),
    );
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

  async getSelectedPostTitles() {
    const modal = this.getLocator();

    // 「チェックされているチェックボックス」をまとめて取得
    const checkedBoxes = modal.locator('input[type=checkbox]:checked');

    // 各チェックボックスに対し、親（先祖）の<label>をたどってテキストを取得
    const labelTexts = await checkedBoxes.evaluateAll((boxes) => {
      return boxes.map((box) => {
        const label = box.closest('label');
        // ラベル要素が見つかればそのテキストを返す。なければ空文字にする。
        return label ? label.innerText : '';
      });
    });

    return labelTexts;
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

    const selectedPostTitles = [
      await firstPostTitle.innerText(),
      await secondPostTitle.innerText(),
      await thirdPostTitle.innerText(),
    ];

    return selectedPostTitles;
  }

  async uncheckAllPosts() {
    const modal = this.getLocator();
    const checkboxes = modal.getByRole('checkbox', { checked: true });
    await expect(checkboxes).toHaveCount(3); // 取得処理の待機のために、3件選択されていることを確認

    while (true) {
      const checkedCount = await checkboxes.count();
      if (checkedCount === 0) break;
      await checkboxes.first().click();
    }
  }
}

class HomePage {
  getPickUpSection() {
    const page = playwrightHelper.getPage();
    const pickUpSectionTitle = page.locator('h2', { hasText: '注目記事' });
    return page.locator('section', { has: pickUpSectionTitle });
  }
}

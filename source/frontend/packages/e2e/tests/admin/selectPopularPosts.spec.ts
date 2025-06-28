import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

let initialPopularPostTitles: string[] = [];
let updatedPopularPostTitles: string[] = [];

Given('【人気記事選択】人気記事選択ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/blog/posts/popular') && resp.status() === 200,
    ),
    page.goto(`${process.env.ADMIN_URL}/posts/popular`),
  ]);

  await response.json();
});
Then(
  '【人気記事選択】現在人気記事に設定されている記事のタイトルが3件分表示されている',
  async function () {
    // 人気記事の一覧表示セクションを取得
    const popularPostsSection = new PopularPostsSection().getLocator();
    // セクション内の記事タイトルを取得
    const postTitles = popularPostsSection.locator('h3');
    // セクション内の記事タイトルが3件であることを確認
    expect(await postTitles.count()).toBe(3);
  },
);

When('【人気記事選択】「人気記事を選択」ボタンを押下する', async function () {
  const { getOpenModalButton } = new SelectPopularPostsModal();
  const page = playwrightHelper.getPage();

  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/admin/blog/posts') && resp.status() === 200,
    ),
    getOpenModalButton().click(),
  ]);

  expect(response.status()).toBe(200);

  // json が読み込まれるまで待機
  await response.json();
});
Then('【人気記事選択】人気記事選択モーダルが表示される', async function () {
  const modal = new SelectPopularPostsModal().getLocator();
  await expect(modal).toBeVisible({ timeout: 10000 });
});
Then(
  '【人気記事選択】既存の記事すべてのタイトルが表示される',
  async function () {
    const modal = new SelectPopularPostsModal().getLocator();
    const postTitles = modal.locator('h3');

    expect(await postTitles.count()).toBeGreaterThan(0);
  },
);
Then(
  '【人気記事選択】デフォルトで3件の記事が選択されている',
  async function () {
    const modal = new SelectPopularPostsModal();
    const selectedPostTitles = await modal.getSelectedPostTitles();
    initialPopularPostTitles = selectedPostTitles;
    expect(selectedPostTitles.length).toBe(3);
  },
);

When(
  '【人気記事選択】デフォルトで設定されているものとは違う組み合わせで3件の記事を選択して「保存」ボタンを押す',
  async function () {
    const modal = new SelectPopularPostsModal();
    await modal.uncheckAllPosts();
    const selectedPostTitles = await modal.selectFirstThreePostTitles();
    updatedPopularPostTitles = selectedPostTitles;

    // 選択した記事がデフォルトの人気記事と異なることを確認
    expect(selectedPostTitles).not.toEqual(initialPopularPostTitles);

    modal.getSaveButton().click();
  },
);
Then(
  '【人気記事選択】モーダル内に保存した旨のメッセージが表示される',
  async function () {
    const modal = new SelectPopularPostsModal().getLocator();
    const message = modal.getByText('人気記事を更新しました。');
    await expect(message).toBeVisible({ timeout: 10000 });
  },
);

When('【人気記事選択】モーダルを閉じる', async function () {
  const closeButton = new SelectPopularPostsModal().getCloseModalButton();
  await closeButton.click();
});
Then(
  '【人気記事選択】一覧表示されていたタイトルが新しいものに更新されている',
  async function () {
    const popularPostsSection = new PopularPostsSection().getLocator();
    const postTitles = popularPostsSection.locator('h3');
    const updatedPostTitles = await postTitles.allInnerTexts();
    expect(updatedPostTitles).not.toEqual(initialPopularPostTitles);
  },
);

When('【人気記事選択】トップページへ遷移する', async function () {
  if (!process.env.TEST_TARGET_URL) {
    throw new Error('TEST_TARGET_URL 環境変数が設定されていません');
  }

  // 2秒の revalidate を待つために、念のため4秒待機
  await new Promise((resolve) => setTimeout(resolve, 4000));

  // トップページに遷移
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.TEST_TARGET_URL}`);
});
Then(
  '【人気記事選択】人気記事のセクションに新規設定した人気記事が表示されている',
  async function () {
    const popularPostsSection = new HomePage().getPopularSection();
    const postTitles = popularPostsSection.locator('h3');
    const updatedPostTitles = await postTitles.allInnerTexts();
    // 順不同で、かつ、配列の要素が同じであることを確認
    expect(updatedPostTitles).toEqual(
      expect.arrayContaining(updatedPopularPostTitles),
    );
  },
);

// ヘルパークラス
class PopularPostsSection {
  getLocator() {
    const page = playwrightHelper.getPage();
    const sectionTitle = page.getByText('現在の人気記事');
    return page.locator('section', { has: sectionTitle });
  }
}

class SelectPopularPostsModal {
  getLocator() {
    const page = playwrightHelper.getPage();
    return page.getByRole('dialog');
  }
  getOpenModalButton() {
    const page = playwrightHelper.getPage();
    return page.getByRole('button', { name: '人気記事を選択' });
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
    while (true) {
      const checkedCount = await checkboxes.count();
      if (checkedCount === 0) break;
      await checkboxes.first().click();
    }
  }
}

class HomePage {
  getPopularSection() {
    const page = playwrightHelper.getPage();
    const popularSectionTitle = page.locator('h2', { hasText: '注目記事' });
    return page.locator('section', { has: popularSectionTitle });
  }
}

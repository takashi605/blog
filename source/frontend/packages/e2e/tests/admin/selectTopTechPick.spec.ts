import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

let initialTopTechPickPostTitle: string = '';
let updatedTopTechPickPostTitle: string = '';

Given(
  '【トップテックピック記事選択】トップテックピック記事選択ページにアクセスする',
  async function () {
    if (!process.env.ADMIN_URL) {
      throw new Error('ADMIN_URL 環境変数が設定されていません');
    }
    const page = playwrightHelper.getPage();

    const [response] = await Promise.all([
      page.waitForResponse('**/blog/posts/top-tech-pick*'),
      page.goto(`${process.env.ADMIN_URL}/posts/top-tech-pick`),
    ]);

    expect(response.status()).toBe(200);
    await response.json();
  },
);
Then(
  '【トップテックピック記事選択】現在トップテックピック記事に設定されている記事のタイトルが表示されている',
  async function () {
    // トップテック記事の表示セクションを取得
    const topTechPickPostsSection = new TopTechPickSection().getLocator();
    // セクション内の記事タイトルを取得
    const postTitle = topTechPickPostsSection.locator('h3');
    // セクション内の記事タイトルが1件のみであることを確認
    expect(await postTitle.count()).toBe(1);
  },
);

When(
  '【トップテックピック記事選択】「トップテックピック記事を選択」ボタンを押下する',
  async function () {
    const { getOpenModalButton } = new SelectTopTechPickPostsModal();
    const page = playwrightHelper.getPage();

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes('/blog/posts/latest') && resp.status() === 200,
      ),
      getOpenModalButton().click(),
    ]);

    expect(response.status()).toBe(200);
    await response.json();
  },
);
Then(
  '【トップテックピック記事選択】トップテックピック記事選択モーダルが表示される',
  async function () {
    const modal = new SelectTopTechPickPostsModal().getLocator();
    await expect(modal).toBeVisible({ timeout: 10000 });
  },
);
Then(
  '【トップテックピック記事選択】既存の記事すべてのタイトルが表示される',
  async function () {
    const modal = new SelectTopTechPickPostsModal().getLocator();
    const postTitles = modal.locator('h3');

    expect(await postTitles.count()).toBeGreaterThan(0);
  },
);
Then(
  '【トップテックピック記事選択】デフォルトで1件の記事が選択されている',
  async function () {
    const modal = new SelectTopTechPickPostsModal();
    const selectedPostTitle = await modal.getSelectedPostTitle();
    initialTopTechPickPostTitle = selectedPostTitle;
    expect(selectedPostTitle).not.toBeNull();
  },
);

When(
  '【トップテックピック記事選択】デフォルトで設定されているものとは違う記事を選択して「保存」ボタンを押す',
  async function () {
    const modal = new SelectTopTechPickPostsModal();
    await modal.uncheckAllPosts();
    const selectedPostTitle = await modal.selectFirstPostTitle();
    updatedTopTechPickPostTitle = selectedPostTitle;

    // 選択した記事がデフォルトのトップテックピック記事と異なることを確認
    expect(selectedPostTitle).not.toEqual(initialTopTechPickPostTitle);

    modal.getSaveButton().click();
  },
);
Then(
  '【トップテックピック記事選択】モーダル内に保存した旨のメッセージが表示される',
  async function () {
    const modal = new SelectTopTechPickPostsModal().getLocator();
    const message = modal.getByText('トップテックピック記事を更新しました。');
    await expect(message).toBeVisible({ timeout: 10000 });
  },
);

When('【トップテックピック記事選択】モーダルを閉じる', async function () {
  const closeButton = new SelectTopTechPickPostsModal().getCloseModalButton();
  await closeButton.click();
});
Then(
  '【トップテックピック記事選択】表示されていたタイトルが新しいものに更新されている',
  async function () {
    const topTechPickPostsSection = new TopTechPickSection().getLocator();
    const postTitle = topTechPickPostsSection.locator('h3');
    const updatedPostTitle = await postTitle.innerText();
    expect(updatedPostTitle).not.toEqual(initialTopTechPickPostTitle);
  },
);

When('【トップテックピック記事選択】トップページへ遷移する', async function () {
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
  '【トップテックピック記事選択】トップテックピック記事のセクションに新規設定したトップテックピック記事が表示されている',
  async function () {
    const topTechPickPostsSection = new HomePage().getTopTechPickSection();
    const postTitle = await topTechPickPostsSection.locator('h1').innerText();
    expect(postTitle).toEqual(updatedTopTechPickPostTitle);
  },
);

// ヘルパークラス
class TopTechPickSection {
  getLocator() {
    const page = playwrightHelper.getPage();
    const sectionTitle = page.getByText('現在のトップテックピック記事');
    return page.locator('section', { has: sectionTitle });
  }
}

class SelectTopTechPickPostsModal {
  getLocator() {
    const page = playwrightHelper.getPage();
    return page.getByRole('dialog');
  }
  getOpenModalButton() {
    const page = playwrightHelper.getPage();
    return page.getByRole('button', { name: 'トップテックピック記事を選択' });
  }
  getSaveButton() {
    const modal = this.getLocator();
    return modal.getByRole('button', { name: '保存' });
  }
  getCloseModalButton() {
    const modal = this.getLocator();
    return modal.getByRole('button', { name: '閉じる' });
  }

  async getSelectedPostTitle() {
    const modal = this.getLocator();

    // 「チェックされているチェックボックス」をまとめて取得
    const checkedBoxes = modal.locator('input[type=checkbox]:checked');

    // 1件のみ選択されていることを確認
    expect(await checkedBoxes.count()).toBe(1);

    // チェックボックスのラベルを取得
    const checkedBox = checkedBoxes.first();
    const label = await checkedBox.evaluate((el) => {
      const labelElement = document.querySelector(
        `label[for="${el.id}"]`,
      ) as HTMLElement;
      return labelElement ? labelElement.innerText : '';
    });

    return label;
  }

  async selectFirstPostTitle() {
    const modal = this.getLocator();
    const postTitles = modal.locator('h3');
    const firstPostTitle = postTitles.first();
    await firstPostTitle.click();

    const selectedPostTitle = await firstPostTitle.innerText();

    return selectedPostTitle;
  }

  async uncheckAllPosts() {
    const modal = this.getLocator();
    const checkboxes = modal.getByRole('checkbox', { checked: true });
    await expect(checkboxes).toHaveCount(1); // 取得待機のため、1件のチェックボックスがあることを確認

    while (true) {
      const checkedCount = await checkboxes.count();
      if (checkedCount === 0) break;
      await checkboxes.first().click();
    }
  }
}

class HomePage {
  getTopTechPickSection() {
    const page = playwrightHelper.getPage();
    const topTechPickSectionTitle = page.locator('span', {
      hasText: 'TOP TECH PICK!',
    });
    return page.locator('section', { has: topTechPickSectionTitle });
  }
}

import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

Given('【記事管理 一覧】記事管理ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();

  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/admin/blog/posts') && resp.status() === 200,
    ),
    page.goto(`${process.env.ADMIN_URL}/posts`, { timeout: 20000 }),
  ]);

  await response.json();
});

Then('【記事管理 一覧】記事が3件以上表示されている', async function () {
  const postsSection = new PostsManageSection();
  const postCards = postsSection.getPostCards();
  const count = await postCards.count();
  expect(count).toBeGreaterThanOrEqual(3);
});

Then('【記事管理 一覧】各記事のタイトルが表示されている', async function () {
  const postsSection = new PostsManageSection();
  const postTitles = postsSection.getPostTitles();
  const count = await postTitles.count();
  expect(count).toBeGreaterThanOrEqual(3);

  // 全ての記事タイトルが表示されていることを確認
  for (let i = 0; i < Math.min(count, 3); i++) {
    const title = postTitles.nth(i);
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
  }
});

Then('【記事管理 一覧】各記事の投稿日が表示されている', async function () {
  const postsSection = new PostsManageSection();
  const postDates = postsSection.getPostDates();
  const count = await postDates.count();
  expect(count).toBeGreaterThanOrEqual(3);

  // 全ての記事投稿日が表示されていることを確認
  for (let i = 0; i < Math.min(count, 3); i++) {
    const date = postDates.nth(i);
    await expect(date).toBeVisible();
    const dateText = await date.textContent();
    expect(dateText).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/); // 日付形式の確認
  }
});

Then(
  '【記事管理 一覧】各記事のサムネイル画像が表示されている',
  async function () {
    const postsSection = new PostsManageSection();
    const thumbnailImages = postsSection.getThumbnailImages();
    const count = await thumbnailImages.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // 全てのサムネイル画像が表示されていることを確認
    for (let i = 0; i < Math.min(count, 3); i++) {
      const thumbnail = thumbnailImages.nth(i);
      await expect(thumbnail).toBeVisible();
      const src = await thumbnail.getAttribute('src');
      expect(src).toBeTruthy();
    }
  },
);

Then(
  '【記事管理 一覧】各記事に対応した編集ボタンが存在する',
  async function () {
    const postsSection = new PostsManageSection();
    const postTitles = postsSection.getPostTitles();
    const editButtons = postsSection.getEditButtons();

    const titleCount = await postTitles.count();
    const editButtonCount = await editButtons.count();

    // 記事タイトル数と編集ボタン数が等しいことを確認
    expect(editButtonCount).toBe(titleCount);

    // 全ての編集ボタンが表示されていることを確認
    for (let i = 0; i < editButtonCount; i++) {
      const editButton = editButtons.nth(i);
      await expect(editButton).toBeVisible();
      const buttonText = await editButton.textContent();
      expect(buttonText).toContain('編集');
    }
  },
);

Given(
  '【記事管理 リンク】記事管理 リンクページにアクセスする',
  async function () {
    if (!process.env.ADMIN_URL) {
      throw new Error('ADMIN_URL 環境変数が設定されていません');
    }
    const page = playwrightHelper.getPage();

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/admin/blog/posts') && resp.status() === 200,
      ),
      page.goto(`${process.env.ADMIN_URL}/posts`, { timeout: 20000 }),
    ]);

    await response.json();
  },
);

When(
  '【記事管理 リンク】記事管理ページ内の「記事を投稿」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const createPostButton = page.getByRole('link', { name: '記事を投稿' });
    await createPostButton.click();
  },
);

Then('【記事管理 リンク】記事投稿ページに遷移する', async function () {
  const page = playwrightHelper.getPage();
  await expect(page).toHaveURL(/\/posts\/create/);
});

When(
  '【記事管理 リンク】記事投稿ページ内の「記事管理画面に戻る」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const backButton = page.getByRole('button', { name: '記事管理画面に戻る' });
    await backButton.click();
  },
);

Then(
  '【記事管理 リンク】記事投稿ページから記事管理ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();
    await expect(page).toHaveURL(/\/posts$/);
    const postsSection = new PostsManageSection();
    const postCards = postsSection.getPostCards();
    await expect(postCards.first()).toBeVisible();
  },
);

When(
  '【記事管理 リンク】記事管理ページ内の「ピックアップ記事の管理」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const pickupButton = page.getByRole('link', {
      name: 'ピックアップ記事の管理',
    });
    await pickupButton.click();
  },
);

Then(
  '【記事管理 リンク】ピックアップ記事管理ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();
    await expect(page).toHaveURL(/\/posts\/pickup/);
  },
);

When(
  '【記事管理 リンク】ピックアップ記事管理ページ内の「記事管理画面に戻る」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const backButton = page.getByRole('button', { name: '記事管理画面に戻る' });
    await backButton.click();
  },
);

Then(
  '【記事管理 リンク】ピックアップ記事管理ページから記事管理ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();
    await expect(page).toHaveURL(/\/posts$/);
    const postsSection = new PostsManageSection();
    const postCards = postsSection.getPostCards();
    await expect(postCards.first()).toBeVisible();
  },
);

When(
  '【記事管理 リンク】記事管理ページ内の「人気記事の管理」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const popularButton = page.getByRole('link', { name: '人気記事の管理' });
    await popularButton.click();
  },
);

Then('【記事管理 リンク】人気記事管理ページに遷移する', async function () {
  const page = playwrightHelper.getPage();
  await expect(page).toHaveURL(/\/posts\/popular/);
});

When(
  '【記事管理 リンク】人気記事管理ページ内の「記事管理画面に戻る」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const backButton = page.getByRole('button', { name: '記事管理画面に戻る' });
    await backButton.click();
  },
);

Then(
  '【記事管理 リンク】人気記事管理ページから記事管理ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();
    await expect(page).toHaveURL(/\/posts$/);
    const postsSection = new PostsManageSection();
    const postCards = postsSection.getPostCards();
    await expect(postCards.first()).toBeVisible();
  },
);

When(
  '【記事管理 リンク】記事管理ページ内の「トップテック記事の管理」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const topTechButton = page.getByRole('link', {
      name: 'トップテック記事の管理',
    });
    await topTechButton.click();
  },
);

Then(
  '【記事管理 リンク】トップテック記事管理ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();
    await expect(page).toHaveURL(/\/posts\/top-tech-pick/);
  },
);

When(
  '【記事管理 リンク】トップテック記事管理ページ内の「記事管理画面に戻る」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const backButton = page.getByRole('button', { name: '記事管理画面に戻る' });
    await backButton.click();
  },
);

Then(
  '【記事管理 リンク】トップテック記事管理ページから記事管理ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();
    await expect(page).toHaveURL(/\/posts$/);
    const postsSection = new PostsManageSection();
    const postCards = postsSection.getPostCards();
    await expect(postCards.first()).toBeVisible();
  },
);

When('【記事管理 リンク】適当な記事の編集ボタンを押す', async function () {
  const postsSection = new PostsManageSection();
  const editButtons = postsSection.getEditButtons();
  const firstEditButton = editButtons.first();
  await firstEditButton.click();
});

Then('【記事管理 リンク】記事編集ページに遷移する', async function () {
  const page = playwrightHelper.getPage();
  await expect(page).toHaveURL(/\/posts\/[a-f0-9-]+\/edit/);
});

When(
  '【記事管理 リンク】記事編集ページ内の「記事管理画面に戻る」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const backButton = page.getByRole('button', { name: '記事管理画面に戻る' });
    await backButton.click();
  },
);

Then(
  '【記事管理 リンク】記事編集ページから記事管理ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();
    await expect(page).toHaveURL(/\/posts$/);
    const postsSection = new PostsManageSection();
    const postCards = postsSection.getPostCards();
    await expect(postCards.first()).toBeVisible();
  },
);

// ヘルパークラス
class PostsManageSection {
  getLocator() {
    const page = playwrightHelper.getPage();
    return page.locator('[data-testid="posts-manage-section"]');
  }

  getPostCards() {
    const section = this.getLocator();
    return section.locator('[data-testid="post-card"]');
  }

  getPostTitles() {
    const postCards = this.getPostCards();
    return postCards.locator('h3');
  }

  getPostDates() {
    const postCards = this.getPostCards();
    return postCards.locator('[data-testid="post-date"]');
  }

  getThumbnailImages() {
    const postCards = this.getPostCards();
    return postCards.locator('img[alt="サムネイル画像"]');
  }

  getEditButtons() {
    const postCards = this.getPostCards();
    return postCards.locator('a:has-text("編集")');
  }
}

import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import PostsManageSection from '../../../pageObjects/postsManageSection.js';
import { clearSelectionByArrow, selectByArrowLeft } from '../postScenarios/helper.js';
import playwrightHelper from '../../../support/playwrightHelper.js';

if (!process.env.ADMIN_URL) {
  throw new Error('ADMIN_URL 環境変数が設定されていません');
}

Given('【正常系 記事編集】記事投稿ページにアクセスする', async function () {
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/posts/create`, { timeout: 20000 });
});

When('【正常系 記事編集】タイトルに「編集前」と入力する', async function () {
  const page = playwrightHelper.getPage();
  const titleInput = page.getByRole('textbox', { name: 'タイトル' });
  await titleInput.fill('編集前');
});

When('【正常系 記事編集】公開日に「2013-01-01」と入力する', async function () {
  const page = playwrightHelper.getPage();
  const publishedAtInput = page.getByRole('combobox', { name: '公開日' });
  await publishedAtInput.fill('2013-01-01');
});

When('【正常系 記事編集】公開日を「2013-01-02」に変更する', async function () {
  const page = playwrightHelper.getPage();
  const publishedAtInput = page.getByRole('combobox', { name: '公開日' });
  await publishedAtInput.fill('2013-01-02');
});

Then('【正常系 記事編集】公開日に「2013-01-02」が設定されていることを確認する', async function () {
  const page = playwrightHelper.getPage();
  const publishedAtInput = page.getByRole('combobox', { name: '公開日' });
  await expect(publishedAtInput).toHaveValue('2013-01-02');
});

When(
  '【正常系 記事編集】サムネイル画像選択モーダルを開き、1番目のサムネイル画像を選択する',
  async function () {
    const page = playwrightHelper.getPage();

    // サムネイル画像選択ボタンをクリック
    const thumbnailButton = page.getByRole('button', {
      name: 'サムネイル画像を選択',
    });
    await thumbnailButton.click();

    // モーダルが表示されるまで待機
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 1番目の画像を選択
    const labelsInModal = modal.locator('label');
    const firstLabelInModal = labelsInModal.first();
    await firstLabelInModal.click();

    // 閉じるボタンをクリック
    const closeButton = modal.getByRole('button', { name: '閉じる' });
    await closeButton.click();

    // モーダルが閉じられるまで待機
    await expect(modal).not.toBeVisible();
  },
);

When('【正常系 記事編集】リッチテキストエディタに「編集前のテスト」と入力する', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toBeVisible({ timeout: 10000 });

  await richTextEditor.pressSequentially('編集前のテスト', { timeout: 10000 });
  await page.waitForTimeout(200);
});

When('【正常系 記事編集】「投稿」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();
  const publishButton = page.getByRole('button', { name: '投稿' });

  await Promise.all([
    page.waitForURL('**/posts/create/success**'),
    publishButton.click(),
  ]);
});

Then(
  '【正常系 記事編集】記事が投稿され、投稿完了ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();

    // 投稿完了メッセージの確認
    await expect(page.getByText('記事を公開しました')).toBeVisible({
      timeout: 10000,
    });
  },
);

When(
  '【正常系 記事編集】記事管理ページを経由し、記事編集ページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();

    // 記事管理ページにアクセス
    await page.goto(`${process.env.ADMIN_URL}/posts`, { timeout: 20000 });

    // 投稿した記事を探して編集ページに移動
    const postsManageSection = new PostsManageSection();
    const postCards = postsManageSection.getPostCards();

    // 作成した記事を見つける
    const targetCard = postCards.filter({ hasText: '編集前' }).first();
    await expect(targetCard).toBeVisible();

    // 編集ボタンをクリック
    const editButton = targetCard.getByRole('link', { name: '編集' });
    await editButton.click();

    // 編集ページに遷移したことを確認
    await expect(page).toHaveURL(/\/posts\/[^\/]+\/edit/, { timeout: 10000 });
  },
);

Then(
  '【正常系 記事編集】リッチテキストエディタが表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toBeVisible({ timeout: 10000 });
  },
);

When('【正常系 記事編集】タイトルを「編集後」に変更する', async function () {
  const page = playwrightHelper.getPage();
  const titleInput = page.getByRole('textbox', { name: 'タイトル' });
  await titleInput.fill('編集後');
});

Then('【正常系 記事編集】タイトルに「編集後」と表示されている', async function () {
  const page = playwrightHelper.getPage();
  const titleInput = page.getByRole('textbox', { name: 'タイトル' });
  await expect(titleInput).toHaveValue('編集後');
});

When(
  '【正常系 記事編集】サムネイル画像選択モーダルを開き、2番目のサムネイル画像を選択する',
  async function () {
    const page = playwrightHelper.getPage();

    // サムネイル画像選択ボタンをクリック
    const thumbnailButton = page.getByRole('button', {
      name: 'サムネイル画像を選択',
    });
    await thumbnailButton.click();

    // モーダルが表示されるまで待機
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 2番目の画像を選択
    const labelsInModal = modal.locator('label');
    const secondLabelInModal = labelsInModal.nth(1);
    await secondLabelInModal.click();

    // 閉じるボタンをクリック
    const closeButton = modal.getByRole('button', { name: '閉じる' });
    await closeButton.click();

    // モーダルが閉じられるまで待機
    await expect(modal).not.toBeVisible();
  },
);

Then(
  '【正常系 記事編集】モーダルを閉じると、編集画面内にサムネイル画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();

    // サムネイル画像プレビューエリアでの画像表示を確認
    const thumbnailImage = page.getByRole('img', { name: 'サムネイル画像' });
    await expect(thumbnailImage).toBeVisible();
  },
);

When('【正常系 記事編集】リッチテキストエディタ内の「編集前のテスト」という文字を削除する', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');

  // 全選択
  await richTextEditor.press('Control+A');
  await page.keyboard.press('Delete');
  await clearSelectionByArrow(page, richTextEditor);
});


Then('【正常系 記事編集】リッチテキストエディタに「編集前のテスト」が表示されなくなる', async function () {
  const page = playwrightHelper.getPage();
  await expect(page.locator('[contenteditable="true"]')).not.toContainText(
    '編集前のテスト',
  );
});

When('【正常系 記事編集】リッチテキストエディタに「編集テスト」と入力する', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toBeVisible({ timeout: 10000 });

  await richTextEditor.pressSequentially('編集テスト', { timeout: 10000 });
  await page.waitForTimeout(200);
});

Then('【正常系 記事編集】リッチテキストエディタに「編集テスト」が表示される', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');

  await expect(richTextEditor).toContainText('編集テスト');
});

When('【正常系 記事編集】「編集太字テスト」と入力し、その文字を選択して太字ボタンを押す', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');

  const inputText = '編集太字テスト';

  await richTextEditor.pressSequentially(inputText, { timeout: 10000 });
  await page.waitForTimeout(200);

  await selectByArrowLeft(page, richTextEditor, inputText.length);

  const boldButton = page.getByRole('checkbox', { name: 'bold' });
  await boldButton.click();

  await clearSelectionByArrow(page, richTextEditor);
});

Then('【正常系 記事編集】リッチテキストエディタに「編集太字テスト」と表示され、太字になっている', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');

  const boldText = richTextEditor.locator('strong');
  await expect(boldText).toHaveText('編集太字テスト', { timeout: 10000 });
});

When('【正常系 記事編集】「編集インラインコードテスト」と入力し、その文字を選択してインラインコードボタンを押す', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');

  const inputText = '編集インラインコードテスト';

  await richTextEditor.pressSequentially(inputText, { timeout: 10000 });
  await page.waitForTimeout(200);

  await selectByArrowLeft(page, richTextEditor, inputText.length);

  const inlineCodeButton = page.getByRole('checkbox', {
    name: 'inline-code',
  });
  await inlineCodeButton.click();

  await clearSelectionByArrow(page, richTextEditor);
});

Then('【正常系 記事編集】リッチテキストエディタに「編集インラインコードテスト」と表示され、インラインコードになっている', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');

  const inlineCode = richTextEditor
    .getByRole('code')
    .filter({ hasText: '編集インラインコードテスト' });
  await expect(inlineCode).toBeVisible({ timeout: 10000 });
});

When('【正常系 記事編集】「編集リンクテスト」という文字を入力・選択し、リンクボタンを押す', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');

  richTextEditor.press('Enter');
  await page.waitForTimeout(200);

  const inputText = '編集リンクテスト';

  await richTextEditor.pressSequentially(inputText, { timeout: 10000 });
  await page.waitForTimeout(200);

  await selectByArrowLeft(page, richTextEditor, inputText.length);

  const linkButton = page.getByRole('checkbox', { name: 'link' });
  await linkButton.click();
});

Then('【正常系 記事編集】リンク設定 input が出現する', async function () {
  const page = playwrightHelper.getPage();

  const linkInput = page.getByRole('textbox', {
    name: 'URL(https:// から始まるもの)を入力してください。',
  });
  await expect(linkInput).toBeVisible({ timeout: 10000 });
});

When('【正常系 記事編集】リンク設定 input に「example.com」と入力する', async function () {
  const page = playwrightHelper.getPage();

  const linkInput = page.getByRole('textbox', {
    name: 'URL(https:// から始まるもの)を入力してください。',
  });
  await linkInput.fill('https://example.com');

  const insertButton = page.getByRole('button', { name: 'リンクを挿入' });
  await insertButton.click();

  await clearSelectionByArrow(page, page.locator('[contenteditable="true"]'));
});

When('【正常系 記事編集】「編集テスト見出し2」と入力し、その文字を選択して「h2」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');

  const inputText = '編集テスト見出し2';

  richTextEditor.press('Enter');
  await page.waitForTimeout(200);

  await richTextEditor.pressSequentially(inputText, { timeout: 10000 });
  await page.waitForTimeout(200);

  await selectByArrowLeft(page, richTextEditor, inputText.length);
  await page.waitForTimeout(200);

  const h2Button = page.getByRole('checkbox', { name: 'h2' });
  await h2Button.click();
  await clearSelectionByArrow(page, richTextEditor);
  await page.waitForTimeout(200);
});

Then('【正常系 記事編集】リッチテキストエディタに「編集テスト見出し2」と表示され、レベル2見出しになっている', async function () {
  const page = playwrightHelper.getPage();
  const richTextEditor = page.locator('[contenteditable="true"]');

  const h2Text = richTextEditor.locator('h2');
  await expect(h2Text).toHaveText('編集テスト見出し2', { timeout: 10000 });
});

When(
  '【正常系 記事編集】数行のコードを入力し、「code」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();
    const richTextEditor = page.locator('[contenteditable="true"]');

    const inputTextA = 'const a = 1';
    const inputTextB = 'const b = 3';

    await richTextEditor.press('Enter');
    await page.waitForTimeout(200);

    await richTextEditor.pressSequentially(inputTextA);
    await richTextEditor.press('Enter');
    await richTextEditor.pressSequentially(inputTextB);
    await page.waitForTimeout(200);

    const textLength = inputTextA.length + inputTextB.length + 1; // 1はエンターを押した数
    await selectByArrowLeft(page, richTextEditor, textLength);

    const codeButton = page.getByRole('checkbox', { name: /^code$/ });
    await codeButton.click();
  },
);

Then(
  '【正常系 記事編集】エディタ内にコードブロックが存在している',
  async function () {
    const page = playwrightHelper.getPage();

    const codeBlock = page.getByRole('code').filter({
      hasText: 'const a = 1',
    });

    await expect(codeBlock).toHaveText('const a = 1const b = 3', {
      timeout: 10000,
    });
  },
);

When(
  '【正常系 記事編集】画像選択モーダルを開き、画像を選択する',
  async function () {
    const page = playwrightHelper.getPage();
    const richTextEditor = page.locator('[contenteditable="true"]');

    await richTextEditor.press('Control+End');
    await page.waitForTimeout(500);

    await richTextEditor.press('Enter');
    await richTextEditor.press('Enter');
    await richTextEditor.press('Enter');
    await page.waitForTimeout(200);

    const openModalButton = page.getByRole('button', { name: '画像を挿入' });
    await openModalButton.click();

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });

    const modal = page.getByRole('dialog');
    const labelsInModal = modal.locator('label');
    const firstLabelInModal = labelsInModal.first();
    await firstLabelInModal.click();

    // 画像を選択し、選択モーダルを閉じる
    const imageInsertButton = modal.getByRole('button', {
      name: '挿入',
    });
    await imageInsertButton.click();
    await expect(modal).not.toBeVisible({ timeout: 10000 });
  },
);

Then(
  '【正常系 記事編集】モーダルを閉じると、リッチテキストエディタ内に画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    const richTextEditor = page.locator('[contenteditable="true"]');
    const imageContent = richTextEditor.locator('img');
    await expect(imageContent).toBeVisible({ timeout: 10000 });
  },
);

When('【正常系 記事編集】「編集確定」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();
  const updateButton = page.getByRole('button', { name: '編集確定' });
  await updateButton.first().click();
});

Then(
  '【正常系 記事編集】記事が編集され、編集完了ページに遷移する',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 編集完了メッセージの確認
    await expect(page.getByText('記事を編集しました')).toBeVisible({
      timeout: 10000,
    });
  },
);

Then(
  '【正常系 記事編集】編集した記事へのリンクが表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 編集した記事へのリンクが表示されていることを確認
    const articleLink = page.getByRole('link', { name: '編集した記事を見る' });
    await expect(articleLink).toBeVisible();
  },
);

When(
  '【正常系 記事編集】編集した記事のページにアクセスする',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 編集した記事へのリンクをクリック
    const articleLink = page.getByRole('link', { name: '編集した記事を見る' });
    await articleLink.click();
  },
);

Then('【正常系 記事編集】タイトルが「編集後」になっている', async function () {
  const page = playwrightHelper.getPage();
  
  const titleElement = page.locator('h1');
  await expect(titleElement).toHaveText('編集後');
});

Then(
  '【正常系 記事編集】選択したサムネイル画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    
    // サムネイル画像が表示されていることを確認
    const thumbnailImage = page.getByRole('img', { name: 'サムネイル画像' });
    await expect(thumbnailImage).toBeVisible();
  },
);

Then(
  '【正常系 記事編集】本文に追加入力された内容が表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    
    // 本文に追加された内容が表示されていることを確認
    await expect(page.locator('body')).toContainText('編集テスト');
  },
);

Then('【正常系 記事編集】「編集前のテスト」という文字が表示されていない', async function () {
  const page = playwrightHelper.getPage();
  
  await expect(page.locator('body')).not.toContainText('編集前のテスト');
});

Then('【正常系 記事編集】「編集テスト」という文字が表示されている', async function () {
  const page = playwrightHelper.getPage();
  
  await expect(page.locator('body')).toContainText('編集テスト');
});

Then('【正常系 記事編集】「編集太字テスト」が太字になっている', async function () {
  const page = playwrightHelper.getPage();
  
  await expect(
    page.locator('strong').filter({ hasText: '編集太字テスト' }),
  ).toBeVisible();
});

Then('【正常系 記事編集】「編集インラインコードテスト」がインラインコードになっている', async function () {
  const page = playwrightHelper.getPage();
  
  const inlineCode = page.getByRole('code').filter({
    hasText: '編集インラインコードテスト',
  });
  await expect(inlineCode).toBeVisible();
});

Then('【正常系 記事編集】「編集リンクテスト」という文字のリンクが存在する', async function () {
  const page = playwrightHelper.getPage();
  
  const linkText = page.locator('a', { hasText: '編集リンクテスト' });
  await expect(linkText).toBeVisible();
});

Then('【正常系 記事編集】h2見出しが存在している', async function () {
  const page = playwrightHelper.getPage();
  
  const h2Element = page.locator('h2').filter({ hasText: '編集テスト見出し2' });
  await expect(h2Element).toBeVisible();
});

Then('【正常系 記事編集】コードブロックが存在している', async function () {
  const page = playwrightHelper.getPage();
  
  const codeBlock = page.getByRole('code').filter({
    hasText: 'const a = 1',
  });
  await expect(codeBlock).toBeVisible();
});

Then('【正常系 記事編集】画像コンテンツが表示されている', async function () {
  const page = playwrightHelper.getPage();
  
  // サムネイル画像以外の画像（記事内の画像）が表示されていることを確認
  const allImages = page.locator('img');
  
  // 画像が複数存在し、その中にサムネイル以外の画像があることを確認
  await expect(allImages).toHaveCount(2, { timeout: 10000 }); // サムネイル + 記事内画像
});

Then('【正常系 記事編集】投稿日が今日の日付になっている', async function () {
  const page = playwrightHelper.getPage();
  
  const today = new Date().toISOString().split('T')[0];
  // 正規表現パターンで投稿日を取得
  await expect(page.getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/)).toContainText(today);
});

Then('【正常系 記事編集】更新日が今日の日付になっている', async function () {
  const page = playwrightHelper.getPage();
  
  const today = new Date().toISOString().split('T')[0];
  // 正規表現パターンで更新日を取得
  await expect(page.getByText(/更新日:\d{4}\/\d{1,2}\/\d{1,2}/)).toContainText(today);
});
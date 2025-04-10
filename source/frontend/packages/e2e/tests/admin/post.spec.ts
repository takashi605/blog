import { Given, Then, When } from '@cucumber/cucumber';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import playwrightHelper from '../../support/playwrightHelper.ts';

let selectedThumbnailImageSrc: string | null = null;
let selectedImageContentSrc: string | null = null;

Given('記事投稿ページにアクセスする', async function () {
  if (!process.env.ADMIN_URL) {
    throw new Error('ADMIN_URL 環境変数が設定されていません');
  }
  const page = playwrightHelper.getPage();
  await page.goto(`${process.env.ADMIN_URL}/posts/create`);
});

Then('リッチテキストエディタが表示されていることを確認する', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toBeVisible({ timeout: 10000 });
});

When('タイトルに「テスト記事」と入力する', async function () {
  const page = playwrightHelper.getPage();

  const titleInput = page.getByRole('textbox', { name: 'タイトル' });
  await titleInput.fill('テスト記事');
});

Then('タイトルに「テスト記事」と表示される', async function () {
  const page = playwrightHelper.getPage();

  const titleInput = page.getByRole('textbox', { name: 'タイトル' });
  await expect(titleInput).toHaveValue('テスト記事');
});

When('サムネイル画像選択モーダルを開き、サムネイル画像を選択する', async () => {
  // 参考：https://playwright.dev/docs/api/class-filechooser
  const page = playwrightHelper.getPage();

  const openModalButton = page.getByRole('button', {
    name: 'サムネイル画像を選択',
  });
  await openModalButton.click();

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: 10000 });

  const radioButtonsInModal = modal.getByRole('radio');
  const firstRadioButton = radioButtonsInModal.first();
  await firstRadioButton.click();

  // 対応する画像の src 属性を取得して変数に保持
  const labelsInModal = modal.locator('label');
  const firstLabelInModal = labelsInModal.first();
  selectedThumbnailImageSrc = await firstLabelInModal
    .locator('img')
    .getAttribute('src');
});
Then(
  'モーダルを閉じると、投稿画面内にサムネイル画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    const modal = page.getByRole('dialog');
    const closeButton = modal.getByRole('button', { name: '閉じる' });
    await closeButton.click();

    const thumbnailImage = page.getByRole('img', { name: 'サムネイル画像' });
    await expect(thumbnailImage).toBeVisible();
  },
);

When('リッチテキストエディタに「こんにちは！」と入力する', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  await richTextEditor.pressSequentially('こんにちは！', { timeout: 10000 });
});
Then('リッチテキストエディタに「こんにちは！」が表示される', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  await expect(richTextEditor).toHaveText('こんにちは！', { timeout: 10000 });
});
When('「世界」と入力し、その文字を選択して太字ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  // テキストをセット
  await richTextEditor.pressSequentially('世界', { timeout: 10000 });

  await selectByArrowLeft(page, richTextEditor, 2);

  // 太字ボタンを押す
  const boldButton = page.getByRole('checkbox', { name: 'bold' });
  await boldButton.click();

  // 選択の解除
  await clearSelectionByArrow(page, richTextEditor);
});
Then(
  'リッチテキストエディタに「こんにちは！世界」と表示され、世界のみ太字になっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');

    await expect(richTextEditor).toHaveText('こんにちは！世界', {
      timeout: 10000,
    });
    // 「世界」が strong タグで囲われているか確認
    const boldText = richTextEditor.locator('strong');
    await expect(boldText).toHaveText('世界', { timeout: 10000 });
  },
);
When('「世界」を再び選択し、太字ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  await selectByArrowLeft(page, richTextEditor, 2);

  const boldButton = page.getByRole('checkbox', { name: 'bold' });
  await boldButton.click();
  await clearSelectionByArrow(page, richTextEditor);
});
Then(
  'リッチテキストエディタに「こんにちは！世界」と表示され、世界の太字が解除されている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    await expect(richTextEditor).toHaveText('こんにちは！世界', {
      timeout: 10000,
    });
    // 「世界」が strong タグで囲われていないか確認
    const boldText = richTextEditor.locator('strong');
    await expect(boldText).not.toBeVisible({ timeout: 10000 });
  },
);
When(
  '「見出し2」と入力し、その文字を選択して「h2」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    richTextEditor.press('Enter');
    await richTextEditor.pressSequentially('見出し2');
    await selectByArrowLeft(page, richTextEditor, 4);
    const h2Button = page.getByRole('checkbox', { name: 'h2' });
    await h2Button.click();
    await clearSelectionByArrow(page, richTextEditor);
  },
);
Then(
  'リッチテキストエディタに「見出し2」と表示され、レベル2見出しになっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    const h2Text = richTextEditor.locator('h2');
    await expect(h2Text).toHaveText('見出し2', { timeout: 10000 });
  },
);
When(
  '「見出し3」と入力し、その文字を選択して「h3」ボタンを押す',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    richTextEditor.press('Enter');
    await richTextEditor.pressSequentially('見出し3');
    await selectByArrowLeft(page, richTextEditor, 4);
    const h2Button = page.getByRole('checkbox', { name: 'h3' });
    await h2Button.click();
    await clearSelectionByArrow(page, richTextEditor);
  },
);
Then(
  'リッチテキストエディタに「見出し3」と表示され、レベル3見出しになっている',
  async function () {
    const page = playwrightHelper.getPage();

    const richTextEditor = page.locator('[contenteditable="true"]');
    const h3Text = richTextEditor.locator('h3');
    await expect(h3Text).toHaveText('見出し3', { timeout: 10000 });
  },
);
When('「const a = 1」入力し、「code」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  richTextEditor.press('Enter');
  await richTextEditor.pressSequentially('const a = 1');
  const codeButton = page.getByRole('checkbox', { name: 'code' });
  await codeButton.click();
})
Then('エディタ内にコードブロックが存在している', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');

  // class 属性に editor-code が含まれているかで判別
  const codeBlock = richTextEditor.locator('.editor-code');
  await expect(codeBlock).toBeVisible({ timeout: 10000 });
})

When('言語選択セレクトボックスから、「js」を選択', async function () {
  const page = playwrightHelper.getPage();

  const languageSelect = page.getByRole('combobox', {
    name: 'code languages',
  });
  await languageSelect.click();
  await languageSelect.selectOption('js');
});
Then('コードブロックの言語データ属性が「js」になっている', async function () {
  const page = playwrightHelper.getPage();

  const richTextEditor = page.locator('[contenteditable="true"]');
  const codeBlock = richTextEditor.locator('.editor-code');
  const languageDataAttribute = await codeBlock.getAttribute('data-language');

  expect(languageDataAttribute).toBe('js');
})

When('画像選択モーダルを開き、画像を選択する', async function () {
  const page = playwrightHelper.getPage();

  // 改行を入れて、画像を挿入する位置を確保
  // コードブロックから抜けるには、3回 Enter を押す
  const richTextEditor = page.locator('[contenteditable="true"]');
  richTextEditor.press('Enter');
  richTextEditor.press('Enter');
  richTextEditor.press('Enter');

   const openModalButton = page.getByRole('button', { name: '画像を挿入' });
  await openModalButton.click();

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: 10000 });

  const radioButtonsInModal = modal.getByRole('radio');
  const firstRadioButton = radioButtonsInModal.first();
  await firstRadioButton.click();

  const imageInsertButton = modal.getByRole('button', {
    name: '挿入',
  });
  await imageInsertButton.click();

  // 対応する画像の src 属性を取得して変数に保持
  const labelsInModal = modal.locator('label');
  const firstLabelInModal = labelsInModal.first();
  selectedImageContentSrc = await firstLabelInModal
    .locator('img')
    .getAttribute('src');

  // 選択した画像の src を保持
  selectedThumbnailImageSrc = selectedImageContentSrc;
});
Then(
  'モーダルを閉じると、リッチテキストエディタ内に画像が表示されている',
  async function () {
    const page = playwrightHelper.getPage();
    const modal = page.getByRole('dialog');
    const closeButton = modal.getByRole('button', { name: '閉じる' });
    await closeButton.click();

    const richTextEditor = page.locator('[contenteditable="true"]');
    const imageContent = richTextEditor.locator('img');
    await expect(imageContent).toBeVisible({ timeout: 10000 });
    const src = await imageContent.getAttribute('src');

    expectMatchImageResourceByCloudinary(src);
  },
);
When('「投稿」ボタンを押す', async function () {
  const page = playwrightHelper.getPage();

  const publishButton = page.getByRole('button', { name: '投稿' });
  await publishButton.click();
});
Then('記事が投稿され、投稿完了ページに遷移する', async function () {
  const page = playwrightHelper.getPage();

  await expect(page.getByText('記事を公開しました')).toBeVisible({
    timeout: 10000,
  });
});
Then('投稿した記事へのリンクが表示されている', async function () {
  const page = playwrightHelper.getPage();

  const postedPageLink = page.locator('a', { hasText: '投稿した記事を見る' });
  await expect(postedPageLink).toBeVisible();
});

Given('投稿した記事のページにアクセスする', async function () {
  const page = playwrightHelper.getPage();

  const postedPageLink = page.locator('a', { hasText: '投稿した記事を見る' });
  await postedPageLink.click();
});
Then('タイトルが「テスト記事」になっている', async function () {
  const page = playwrightHelper.getPage();

  const title = page.locator('h1');
  await expect(title).toHaveText('テスト記事');
});
Then('選択したサムネイル画像が表示されている', async function () {
  const page = playwrightHelper.getPage();

  const thumbnailImage = page.getByRole('img', { name: 'サムネイル画像' });
  const src = await thumbnailImage.getAttribute('src');

  expectMatchImageResourceByCloudinary(src);
});
Then('本文に「こんにちは！世界」と表示されている', async function () {
  const page = playwrightHelper.getPage();

  const content = page.locator('p');
  await expect(content).toHaveText('こんにちは！世界');
});
Then('世界が太字になっていない', async function () {
  const page = playwrightHelper.getPage();

  const boldText = page.locator('strong');
  await expect(boldText).not.toBeVisible();
});
Then('「見出し2」という文字の h2 が存在する', async function () {
  const page = playwrightHelper.getPage();
  const h2 = page.locator('h2');
  await expect(h2).toHaveText('見出し2');
});
Then('「見出し3」という文字の h3 が存在する', async function () {
  const page = playwrightHelper.getPage();
  const h3 = page.locator('h3');
  await expect(h3).toHaveText('見出し3');
});
Then('コードブロックが存在している', async function () {
  const page = playwrightHelper.getPage();

  const codeBlock = page.getByRole('code')
  await expect(codeBlock).toBeVisible({ timeout: 10000 });
})
Then('コードブロックの言語が「js」になっている', async function () {
  const page = playwrightHelper.getPage();

  const codeBlock = page.getByRole('code');
  const languageDataAttribute = await codeBlock.getAttribute('data-language');

  expect(languageDataAttribute).toBe('js');
})
Then('コードブロック内に「const a = 1」が表示されている', async function () {
  const page = playwrightHelper.getPage();

  const codeBlock = page.getByRole('code');
  await expect(codeBlock).toHaveText('const a = 1');
})
Then('画像が表示されている', async function () {
  const page = playwrightHelper.getPage();

  const thumbnailImage = page.getByRole('img', { name: '画像コンテンツ' });
  const src = await thumbnailImage.getAttribute('src');

  expectMatchImageResourceByCloudinary(src);
});
Then('投稿日が今日の日付になっている', async function () {
  const page = playwrightHelper.getPage();
  const postDate = page.getByText(/投稿日:\d{4}\/\d{1,2}\/\d{1,2}/);
  expect(await postDate.textContent()).toContain(
    formatDate2DigitString(new Date()),
  );
});
Then('更新日が今日の日付になっている', async function () {
  const page = playwrightHelper.getPage();
  const lastUpdateDate = page.getByText(/更新日:\d{4}\/\d{1,2}\/\d{1,2}/);
  expect(await lastUpdateDate.textContent()).toContain(
    formatDate2DigitString(new Date()),
  );
});

// 以下ヘルパ関数
async function selectByArrowLeft(page: Page, locator: Locator, count: number) {
  await page.keyboard.down('Shift');
  for (let i = 1; i <= count; i++) {
    await locator.press('ArrowLeft');
  }
  await page.keyboard.up('Shift');
}
async function clearSelectionByArrow(page: Page, locator: Locator) {
  // Shiftキーが押されていないことを確実にしておく
  await page.keyboard.up('Shift');
  // 右矢印を1回押すだけで選択が外れる
  await locator.press('ArrowRight');
}
export const formatDate2DigitString = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return date.toLocaleDateString('ja-JP', options);
};

// Cloudinary の URL はリソースのパス以外の情報も含まれるため、
// リソースのパス部分のみを比較する
// 例: https://res.cloudinary.com/.../v1/test-book?_a=...
// 「/v1/ から ? または # まで」の文字列を取り出す
function expectMatchImageResourceByCloudinary(src: string | null) {
  const resourceRegex = /\/v1\/([^?#]+)/;

  const matchSelected = selectedThumbnailImageSrc!.match(resourceRegex);
  const matchCurrent = src!.match(resourceRegex);

  // どちらも正規表現にマッチしているか確認
  expect(matchSelected).not.toBeNull();
  expect(matchCurrent).not.toBeNull();

  // マッチした文字列同士を比較
  // （例: v1/test-book）
  expect(matchCurrent?.[1]).toBe(matchSelected?.[1]);
}

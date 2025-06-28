import type { Locator, Page } from '@playwright/test';

export async function selectByArrowLeft(page: Page, locator: Locator, count: number) {
  await page.keyboard.down('Shift');
  await page.waitForTimeout(200); // 入力後の安定性のために少し待機
  for (let i = 1; i <= count; i++) {
    await locator.press('ArrowLeft');
  }
  await page.waitForTimeout(200); // 入力後の安定性のために少し待機

  await page.keyboard.up('Shift');
  await page.waitForTimeout(200); // 入力後の安定性のために少し待機
}

export async function clearSelectionByArrow(page: Page, locator: Locator) {
  // Shiftキーが押されていないことを確実にしておく
  await page.keyboard.up('Shift');
  await page.waitForTimeout(200); // 入力後の安定性のために少し待機

  // 右矢印を1回押すだけで選択が外れる
  await locator.press('ArrowRight');
  await page.waitForTimeout(200); // 入力後の安定性のために少し待機
}

export function formatDate2DigitString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return date.toLocaleDateString('ja-JP', options);
};

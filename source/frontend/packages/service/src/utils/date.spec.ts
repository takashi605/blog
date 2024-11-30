import { formatDate2DigitString } from './date';

describe('日付関連関数', () => {
  it('日付を 2024/01/03 の形式に変換する', () => {
    const date = new Date('2024-01-03');
    expect(formatDate2DigitString(date)).toBe('2024/01/03');
  });
});

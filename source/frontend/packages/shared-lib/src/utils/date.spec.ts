import timezoneMock from 'timezone-mock';
import { formatDate2DigitString, toISOStringWithTimezone } from './date';

describe('日付関連関数', () => {
  it('日付を 2024/01/03 の形式に変換する', () => {
    const date = new Date('2024-01-03');
    expect(formatDate2DigitString(date)).toBe('2024/01/03');
  });

  it('timezone 付きの日付を ISO8601 形式に変換する', () => {
    timezoneMock.register('Etc/GMT-9');
    const date = new Date('2024-01-03T12:34:56');
    expect(toISOStringWithTimezone(date)).toBe('2024-01-03T12:34:56+09:00');
    timezoneMock.unregister();
  });

  it('UTC の場合は timezone が Z になる', () => {
    timezoneMock.register('UTC');
    // テスト実行
    const date = new Date('2024-01-03T12:34:56');
    expect(toISOStringWithTimezone(date)).toBe('2024-01-03T12:34:56Z');
    timezoneMock.unregister();
  });
});

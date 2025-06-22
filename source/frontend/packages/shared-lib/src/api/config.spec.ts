/**
 * config.ts のテスト
 */

import { normalizeApiPath } from './config';

describe('normalizeApiPath', () => {
  it('/apiで始まるパスから/apiを除去する', () => {
    const input = '/api/blog/posts/123';
    const expected = '/blog/posts/123';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('/apiで始まらないパスはそのまま返す', () => {
    const input = '/blog/posts/123';
    const expected = '/blog/posts/123';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('空文字列を処理する', () => {
    const input = '';
    const expected = '';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('/apiのみの場合は空文字列を返す', () => {
    const input = '/api';
    const expected = '';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('/api/のみの場合は/を返す', () => {
    const input = '/api/';
    const expected = '/';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('複数の/apiがある場合は最初のもののみ除去', () => {
    const input = '/api/api/blog/posts';
    const expected = '/api/blog/posts';
    expect(normalizeApiPath(input)).toBe(expected);
  });
});

/**
 * config.ts のテスト
 */

import { normalizeApiPath } from './config';

describe('normalizeApiPath', () => {
  it('/api/v2で始まるパスから/api/v2を除去する', () => {
    const input = '/api/v2/blog/posts/123';
    const expected = '/blog/posts/123';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('/api/v2で始まらないパスはそのまま返す', () => {
    const input = '/blog/posts/123';
    const expected = '/blog/posts/123';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('空文字列を処理する', () => {
    const input = '';
    const expected = '';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('/api/v2のみの場合は空文字列を返す', () => {
    const input = '/api/v2';
    const expected = '';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('/api/v2/のみの場合は/を返す', () => {
    const input = '/api/v2/';
    const expected = '/';
    expect(normalizeApiPath(input)).toBe(expected);
  });

  it('複数の/api/v2がある場合は最初のもののみ除去', () => {
    const input = '/api/v2/api/v2/blog/posts';
    const expected = '/api/v2/blog/posts';
    expect(normalizeApiPath(input)).toBe(expected);
  });
});
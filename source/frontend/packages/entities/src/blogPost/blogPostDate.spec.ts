import { EntityError } from '../error/error';
import { createBlogPostDate, n__BlogPostDate } from './blogPostDate';

describe('【旧】エンティティ：投稿記事の日付', () => {
  it('日付を生成できる', () => {
    const blogPostDate = createBlogPostDate('2021-01-01');

    const expectedDate = new Date('2021-01-01');
    expect(blogPostDate.getDate()).toEqual(expectedDate);
  });

  it('YYYY-MM-DD の形式ではない文字列を渡すと EntityError が発生する', () => {
    expect(() => createBlogPostDate('')).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
    expect(() => createBlogPostDate('2021-01-01 00:00:00')).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
    expect(() => createBlogPostDate('2021/01/01')).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
  });

  it('エラーの際、EntityError 型のエラーが発生する', () => {
    try {
      createBlogPostDate('');
    } catch (error) {
      expect(error instanceof EntityError).toBeTruthy();
    }
  });
});

describe('エンティティ：投稿記事の日付', () => {
  it('日付を生成できる', () => {
    const blogPostDate = new n__BlogPostDate('2021-01-01');

    const expectedDate = new Date('2021-01-01');
    expect(blogPostDate.getDate()).toEqual(expectedDate);
  });

  it('日付を YYYY/MM/DD の形式で取得できる', () => {
    const blogPostDate = new n__BlogPostDate('2021-01-01');

    expect(blogPostDate.format2DigitString()).toEqual('2021/01/01');
  });

  it('YYYY-MM-DD の形式ではない文字列を渡すと EntityError が発生する', () => {
    expect(() => new n__BlogPostDate('')).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
    expect(() => new n__BlogPostDate('2021-01-01 00:00:00')).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
    expect(() => new n__BlogPostDate('2021/01/01')).toThrow(
      '日付は YYYY-MM-DD 形式で指定してください',
    );
  });

  it('エラーの際、EntityError 型のエラーが発生する', () => {
    try {
      new n__BlogPostDate('');
    } catch (error) {
      expect(error instanceof EntityError).toBeTruthy();
    }
  });
});

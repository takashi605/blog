import { EntityError } from '../error/error';
import { createBlogPostDate } from './blogPostDate';

describe('エンティティ：投稿記事の日付', () => {
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

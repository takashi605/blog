import { createBlogPostDate } from './blogPostDate';

describe('エンティティ：投稿記事の日付', () => {
  it('日付を生成できる', () => {
    const blogPostDate = createBlogPostDate('2021-01-01');

    const expectedDate = new Date('2021-01-01');
    expect(blogPostDate.getDate()).toEqual(expectedDate);
  });
});

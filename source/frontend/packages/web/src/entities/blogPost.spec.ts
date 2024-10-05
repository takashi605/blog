import { createBlogPost, type BlogPost } from './blogPost';

describe('エンティティ: 投稿記事', () => {
  it('ブログ記事の構造を生成できる', async () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    expect(blogPost.title).toBe(title);
  });
});

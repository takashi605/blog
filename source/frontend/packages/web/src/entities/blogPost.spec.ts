import { createBlogPost, type BlogPost } from './blogPost';

describe('エンティティ: 投稿記事', () => {
  it('ブログ記事の構造を生成できる', async () => {
    const title = {
      text: '記事タイトル',
      level: 1,
    };
    const blogPost: BlogPost = createBlogPost(title);
    expect(blogPost.getTitle()).toBe(title.text);
  });
});

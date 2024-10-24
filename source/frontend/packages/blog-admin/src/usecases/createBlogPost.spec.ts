import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import { BlogPostCreator } from './createBlogPost';

describe('ユースケース: 記事の投稿', () => {
  it('ブログ記事のデータを生成できる', () => {
    const builder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1');
    const blogPostCreator = new BlogPostCreator(builder);
    const blogPost = blogPostCreator.buildBlogPost();
    expect(blogPost.getTitleText()).toBe('記事タイトル');
  });

  it('投稿日時と更新日時が今日の日付になる', () => {
    const builder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02');
    const blogPostCreator = new BlogPostCreator(builder);
    const blogPost = blogPostCreator.buildBlogPost();

    const today = onlyYMD(new Date());
    const postDate = onlyYMD(blogPost.getPostDate());
    const lastUpdateDate = onlyYMD(blogPost.getLastUpdateDate());

    expect(postDate).toBe(today);
    expect(lastUpdateDate).toBe(today);

    // 年月日のみを取得する
    function onlyYMD(date: Date) {
      return date.toISOString().split('T')[0];
    }
  });
});

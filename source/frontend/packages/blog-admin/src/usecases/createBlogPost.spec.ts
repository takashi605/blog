import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import { BlogPostCreator } from './createBlogPost';

describe('ユースケース: 記事の投稿', () => {
  it('ブログ記事のビルダーを扱うクラスを生成できる', () => {
    const builder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1');
    const blogPostCreator = new BlogPostCreator(builder);
    console.log(blogPostCreator);
  });
});

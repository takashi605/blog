import type { ViewBlogPostInput, ViewBlogPostOutput } from './viewBlogPost';
import { viewBlogPost } from './viewBlogPost';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('記事のタイトルを入力値として受け取り、ブログ記事の構造として返却する', async () => {
    const input: ViewBlogPostInput = {
      postTitle: '記事タイトル',
    };
    const output: ViewBlogPostOutput = viewBlogPost(input);
    expect(output.postTitle.getTitle()).toBe('記事タイトル');
  });
});

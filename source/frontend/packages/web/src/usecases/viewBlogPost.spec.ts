import type { ViewBlogPostInput, ViewBlogPostOutput } from './viewBlogPost';
import { viewBlogPost } from './viewBlogPost';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('記事のタイトルを入力値として受け取り、ブログ記事の構造として返却する', async () => {
    const input: ViewBlogPostInput = {
      postTitle: {
        text: '記事タイトル',
        level: 1,
      },
    };
    const output: ViewBlogPostOutput = viewBlogPost(input);
    expect(output.postTitle).toBe('記事タイトル');
  });
});

import type { Input, Output } from './blogPostCase';
import { createBlogPost } from './blogPostCase';

describe('ユースケース: 投稿記事', () => {
  it('記事のタイトルを入力値として受け取り、記事の構造を生成できる', async () => {
    const input: Input = {
      postTitle: '記事タイトル',
    };
    const output: Output = createBlogPost(input);
    expect(output.postTitle).toBe('記事タイトル');
  });
});

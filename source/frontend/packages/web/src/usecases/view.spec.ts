import { createBlogPost } from './view';
import type { Input, Output} from './view';

describe('投稿記事の閲覧', () => {
  it('記事のタイトルを入力値として受け取り、記事の構造を生成できる', async () => {
    const input: Input = {
      blogTitle: '記事タイトル',
    };
    const output: Output = createBlogPost(input);
    expect(output.blogTitle).toBe('記事タイトル');
  });
});

import type { ViewBlogPostInput, ViewBlogPostOutput } from './viewBlogPost';
import { viewBlogPost } from './viewBlogPost';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('記事のデータを入力値として受け取り、ブログ記事の構造として返却する', async () => {
    const input: ViewBlogPostInput = {
      postTitle: '記事タイトル',
      h2List: ['h2見出し1', 'h2見出し2', 'h2見出し3'],
      h3List: ['h3見出し1', 'h3見出し2', 'h3見出し3'],
    };

    const output: ViewBlogPostOutput = viewBlogPost(input, input.h2List, input.h3List);
    expect(output.postTitle.getText()).toBe('記事タイトル');
    expect(output.postTitle.getLevel()).toBe(1);
    output.getH2List().forEach((h2, index) => {
      expect(h2.getText()).toBe(input.h2List[index]);
      expect(h2.getLevel()).toBe(2);
    });
    output.getH3List().forEach((h3, index) => {
      expect(h3.getText()).toBe(input.h3List[index]);
      expect(h3.getLevel()).toBe(3);
    });
  });
});

import { createBlogPost } from '@/entities/blogPost';
import { createViewBlogPostInput } from './input';

describe('ユースケース: 投稿記事生成のための入力値', () => {
  it('メソッドチェーンによるファクトリ', () => {
    const input = createViewBlogPostInput()
      .setPostTitle('記事タイトル')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1')
      .addH3('h3見出し2')
      .addParagraph('段落2');

    expect(input.getPostTitle()).toBe('記事タイトル');
    expect(input.getContents().length).toBe(5);

    expect(input.getContents()[0].type).toBe('h2');
    expect(input.getContents()[0].contentValue).toBe('h2見出し1');

    expect(input.getContents()[1].type).toBe('h3');
    expect(input.getContents()[1].contentValue).toBe('h3見出し1');

    expect(input.getContents()[2].type).toBe('paragraph');
    expect(input.getContents()[2].contentValue).toBe('段落1');

    expect(input.getContents()[3].type).toBe('h3');
    expect(input.getContents()[3].contentValue).toBe('h3見出し2');

    expect(input.getContents()[4].type).toBe('paragraph');
    expect(input.getContents()[4].contentValue).toBe('段落2');
  });

  it('コンテンツをエンティティに流し込む', () => {
    const input = createViewBlogPostInput()
      .setPostTitle('記事タイトル')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1')
      .addH3('h3見出し2')
      .addParagraph('段落2');

    const blogPost = createBlogPost(input.getPostTitle());
    input.injectionContentsTo(blogPost);
    expect(blogPost.getContents().length).toBe(5);
    blogPost.getContents().forEach((content, index) => {
      const contentForInput = input.getContents()[index];
      expect(content.getContent()).toBe(contentForInput.contentValue);
      expect(content.getType()).toBe(contentForInput.type);
    });
  });
});

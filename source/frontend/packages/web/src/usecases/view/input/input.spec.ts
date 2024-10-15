import { createViewBlogPostInput } from '@/usecases/view/input/input';

const createInputForTest = () => {
  return createViewBlogPostInput()
    .setPostTitle('記事タイトル')
    .addH2('h2見出し1')
    .addH3('h3見出し1')
    .addParagraph('段落1')
    .addH3('h3見出し2')
    .addParagraph('段落2');
};

describe('ユースケース: 投稿記事生成のための入力値', () => {
  it('BlogPost エンティティを生成できる', () => {
    const input = createInputForTest();
    const blogPost = input.generateBlogPost();

    expect(blogPost.getTitleText()).toBe('記事タイトル');
    expect(blogPost.getContents().length).toBe(5);

    blogPost.getContents().forEach((content, index) => {
      const contentForInput = input.getContents()[index];
      expect(content.getValue()).toBe(contentForInput.contentValue);
      expect(content.getType()).toBe(contentForInput.type);
    });
  });
});

import { createBlogPostBuilder } from '../../blogPost/blogPostBuilder';
import { H2 } from '../postContents/heading';
import { Paragraph } from '../postContents/paragraph';

describe('エンティティ: 投稿記事を生成するビルダークラス', () => {
  it('BlogPost エンティティを生成できる', () => {
    const builder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1');
    const blogPost = builder.build();

    expect(blogPost.getTitleText()).toBe('記事タイトル');

    const expectedPostDate = new Date('2021-01-01');
    expect(blogPost.getPostDate()).toEqual(expectedPostDate);

    const expectedLastUpdateDate = new Date('2021-01-02');
    expect(blogPost.getLastUpdateDate()).toEqual(expectedLastUpdateDate);

    expect(blogPost.getContents().length).toBe(3);

    blogPost.getContents().forEach((content, index) => {
      if (content instanceof H2) {
        expect(content.getValue()).toBe(`h${index + 2}見出し1`);
        expect(content.getType()).toBe(`h${index + 2}`);
      } else if (content instanceof Paragraph) {
        expect(content.getValue()).toBe('段落1');
        expect(content.getType()).toBe('paragraph');
      } else {
        fail('不正なコンテントが含まれています');
      }
    });
  });
});

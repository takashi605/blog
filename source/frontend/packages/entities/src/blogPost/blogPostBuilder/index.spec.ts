import { createBlogPostBuilder } from '../../blogPost/blogPostBuilder';
import type { Heading } from '../postContents/heading';
import type { Paragraph } from '../postContents/paragraph';

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

    // TODO 一時的に不適切な定数化をしているので、後で修正する
    const h2Content = blogPost.getContents()[0] as Heading;
    expect(h2Content.getValue()).toBe('h2見出し1');
    expect(h2Content.getType()).toBe('h2');

    const h3Content = blogPost.getContents()[1] as Heading;
    expect(h3Content.getValue()).toBe('h3見出し1');
    expect(h3Content.getType()).toBe('h3');

    const pContent = blogPost.getContents()[2] as Paragraph;
    expect(pContent.getValue()).toBe('段落1');
    expect(pContent.getType()).toBe('paragraph');
  });
});

import { createBlogPostBuilder } from '../../blogPost/blogPostBuilder';
import { H2, H3 } from '../postContents/heading';
import { ImageContent } from '../postContents/image';
import { Paragraph } from '../postContents/paragraph';

describe('エンティティ: 投稿記事を生成するビルダークラス', () => {
  it('BlogPost エンティティを生成できる', () => {
    const builder = createBlogPostBuilder()
      .setThumbnail('path/to/image')
      .setPostTitle('記事タイトル')
      .setPostDate('2021-01-01')
      .setLastUpdateDate('2021-01-02')
      .addH2(1, 'h2見出し1')
      .addH3(2, 'h3見出し1')
      .addParagraph(3, '段落1')
      .addImage(4, 'path/to/image');
    const blogPost = builder.build();

    expect(blogPost.getTitleText()).toBe('記事タイトル');

    expect(blogPost.getThumbnail().getPath()).toBe('path/to/image');

    const expectedPostDate = new Date('2021-01-01');
    expect(blogPost.getPostDate()).toEqual(expectedPostDate);

    const expectedLastUpdateDate = new Date('2021-01-02');
    expect(blogPost.getLastUpdateDate()).toEqual(expectedLastUpdateDate);

    expect(blogPost.getContents().length).toBe(4);

    blogPost.getContents().forEach((content, index) => {
      if (content instanceof H2) {
        expect(content.getValue()).toBe(`h${index + 2}見出し1`);
        expect(content.getType()).toBe(`h${index + 2}`);
      } else if (content instanceof H3) {
        expect(content.getValue()).toBe('h3見出し1');
        expect(content.getType()).toBe('h3');
      } else if (content instanceof Paragraph) {
        expect(content.getValue()).toBe('段落1');
        expect(content.getType()).toBe('paragraph');
      } else if (content instanceof ImageContent) {
        expect(content.getPath()).toBe('path/to/image');
        expect(content.getType()).toBe('image');
      } else {
        fail('不正なコンテントが含まれています');
      }
    });
  });
});

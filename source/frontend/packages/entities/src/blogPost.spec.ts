import { createBlogPost, type BlogPost } from './blogPost';
import { ContentType, createContent } from './postContents/content';

describe('エンティティ: 投稿記事', () => {
  it('記事タイトルを生成できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    expect(blogPost.getTitleText()).toBe(title);
    expect(blogPost.getTitleLevel()).toBe(1);
  });

  it('コンテンツとして h2,h3 及び段落を持つ記事を生成できる', () => {
    const title = '記事タイトル';
    const h2 = createContent({
      id: 1,
      type: ContentType.H2,
      value: 'h2見出し',
    });
    const h3 = createContent({
      id: 2,
      type: ContentType.H3,
      value: 'h3見出し',
    });
    const paragraph1 = createContent({
      id: 3,
      type: ContentType.Paragraph,
      value: '段落',
    });
    const blogPost: BlogPost = createBlogPost(title)
      .addContent(h2)
      .addContent(h3)
      .addContent(paragraph1);
    const contents = blogPost.getContents();
    expect(contents.length).toBe(3);

    expect(contents[0].getValue()).toBe('h2見出し');
    expect(contents[0].getType()).toBe('h2');
    expect(contents[0].getId()).toBe(1);

    expect(contents[1].getValue()).toBe('h3見出し');
    expect(contents[1].getType()).toBe('h3');
    expect(contents[1].getId()).toBe(2);

    expect(contents[2].getValue()).toBe('段落');
    expect(contents[2].getType()).toBe('paragraph');
    expect(contents[2].getId()).toBe(3);
  });

  it('記事の投稿日付を取得できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    const date = '2021-01-01';
    blogPost.setPostDate(date);
    expect(blogPost.getPostDate()).toEqual(new Date(date));
  });
});

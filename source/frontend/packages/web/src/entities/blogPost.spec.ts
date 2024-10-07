import { ContentType, createContent } from '@/entities/postContants/content';
import { createBlogPost, type BlogPost } from './blogPost';

describe('エンティティ: 投稿記事', () => {
  it('記事タイトルを生成できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title);
    expect(blogPost.getTitleText()).toBe(title);
    expect(blogPost.getTitleLevel()).toBe(1);
  });

  it('old_コンテンツとして h2,h3 及び段落を持つ記事を生成できる', () => {
    const title = '記事タイトル';
    const blogPost: BlogPost = createBlogPost(title)
      .addH2('h2見出し')
      .addParagraph('段落1')
      .addH3('h3見出し')
      .addParagraph('段落2');
    const contents = blogPost.getContents();
    expect(contents.length).toBe(4);

    expect(contents[0].getContent()).toBe('h2見出し');
    expect(contents[0].getContentType()).toBe('h2');
    expect(contents[0].getId()).toBe(1);

    expect(contents[1].getContent()).toBe('段落1');
    expect(contents[1].getContentType()).toBe('paragraph');
    expect(contents[1].getId()).toBe(2);

    expect(contents[2].getContent()).toBe('h3見出し');
    expect(contents[2].getContentType()).toBe('h3');
    expect(contents[2].getId()).toBe(3);

    expect(contents[3].getContent()).toBe('段落2');
    expect(contents[3].getContentType()).toBe('paragraph');
    expect(contents[3].getId()).toBe(4);
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
      .addContent(paragraph1)
    const contents = blogPost.getContents();
    expect(contents.length).toBe(3);

    expect(contents[0].getContent()).toBe('h2見出し');
    expect(contents[0].getContentType()).toBe('h2');
    expect(contents[0].getId()).toBe(1);

    expect(contents[1].getContent()).toBe('h3見出し');
    expect(contents[1].getContentType()).toBe('h3');
    expect(contents[1].getId()).toBe(2);

    expect(contents[2].getContent()).toBe('段落');
    expect(contents[2].getContentType()).toBe('paragraph');
    expect(contents[2].getId()).toBe(3);
  });
});

import { mockBlogPost } from '../../mockData/blogPost/mockBlogPost';
import { ContentType } from './content';
import { RichText, RichTextPart } from './richText';

describe('エンティティ: 投稿記事のコンテント', () => {
  it('h2 見出しを生成できる', () => {
    const h2 = new mockBlogPost('1').mockParts.getMockH2();
    expect(h2.getValue()).toBe('h2見出し');
    expect(h2.getId()).toBe('1');
    expect(h2.getType()).toBe('h2');
  });

  it('h3 見出しを生成できる', () => {
    const h3 = new mockBlogPost('1').mockParts.getMockH3();
    expect(h3.getValue()).toBe('h3見出し');
    expect(h3.getId()).toBeDefined();
    expect(h3.getType()).toBe('h3');
  });

  it('段落を生成できる', () => {
    const paragraph = new mockBlogPost('1').mockParts.getMockParagraph();
    expect(paragraph.getValue()).toEqual(
      new RichText([new RichTextPart('段落')]),
    );
    expect(paragraph.getType()).toBe('paragraph');
    expect(paragraph.getId()).toBeDefined();
  });

  it('画像を生成できる', () => {
    const image = new mockBlogPost('1').mockParts.getMockImageContent();
    expect(image.getPath()).toBe('path/to/image');
    expect(image.getType()).toBe(ContentType.Image);
    expect(image.getId()).toBeDefined();
  });
});

import { ImageContent } from '../postContents/image';
import { Paragraph } from '../postContents/paragraph';
import { ContentType } from './content';
import { H2, H3 } from './heading';

describe('エンティティ: 投稿記事のコンテント', () => {
  it('h2 見出しを生成できる', () => {
    const h2 = new H2(1, 'h2見出し');
    expect(h2.getValue()).toBe('h2見出し');
    expect(h2.getId()).toBe(1);
    expect(h2.getType()).toBe('h2');
  });

  it('h3 見出しを生成できる', () => {
    const h3 = new H3(1, 'h3見出し');
    expect(h3.getValue()).toBe('h3見出し');
    expect(h3.getId()).toBe(1);
    expect(h3.getType()).toBe('h3');
  });

  it('段落を生成できる', () => {
    const paragraph = new Paragraph(1, '段落');
    expect(paragraph.getValue()).toBe('段落');
    expect(paragraph.getType()).toBe('paragraph');
    expect(paragraph.getId()).toBe(1);
  });

  it('画像を生成できる', () => {
    const image = new ImageContent(1, 'path/to/image');
    expect(image.getPath()).toBe('path/to/image');
    expect(image.getType()).toBe(ContentType.Image);
    expect(image.getId()).toBe(1);
  });
});

import { ImageContent } from '../postContents/image';
import type { Paragraph } from '../postContents/paragraph';
import { ContentType, createContent } from './content';
import type { H2 } from './heading';

describe('エンティティ: 投稿記事のコンテント', () => {
  it('コンテント生成関数から h2 見出しを生成できる', () => {
    const h2 = createContent({
      id: 1,
      type: ContentType.H2,
      value: 'h2見出し',
    }) as H2;
    expect(h2.getValue()).toBe('h2見出し');
    expect(h2.getId()).toBe(1);
    expect(h2.getType()).toBe('h2');
  });

  it('コンテント生成関数から h3 見出しを生成できる', () => {
    const h3 = createContent({
      id: 1,
      type: ContentType.H3,
      value: 'h3見出し',
    }) as H2;
    expect(h3.getValue()).toBe('h3見出し');
    expect(h3.getId()).toBe(1);
    expect(h3.getType()).toBe('h3');
  });

  it('コンテント生成関数から段落を生成できる', () => {
    const paragraph = createContent({
      id: 1,
      type: ContentType.Paragraph,
      value: '段落',
    }) as Paragraph;
    expect(paragraph.getValue()).toBe('段落');
    expect(paragraph.getType()).toBe('paragraph');
    expect(paragraph.getId()).toBe(1);
  });

  it('不明なコンテントタイプを指定するとエラーが発生する', () => {
    expect(() =>
      createContent({
        id: 1,
        type: 'unknown' as ContentType,
        value: '不明なコンテント',
      }),
    ).toThrow('不明なコンテントタイプです');
  });

  it('画像を生成できる', () => {
    const image = new ImageContent(1, 'path/to/image');
    expect(image.getPath()).toBe('path/to/image');
    expect(image.getType()).toBe(ContentType.Image);
    expect(image.getId()).toBe(1);
  });
});

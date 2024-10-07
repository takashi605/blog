import { createContent } from '@/entities/postContants/content';
import type { Heading } from '@/entities/postContants/heading';

describe('エンティティ: コンテント', () => {
  it('コンテント生成関数から h1 見出しを生成できる', () => {
    const h1 = createContent({
      id: 1,
      type: 'h1',
      value: 'h1見出し',
    }) as Heading;
    expect(h1.getContent()).toBe('h1見出し');
    expect(h1.getLevel()).toBe(1);
    expect(h1.getId()).toBe(1);
    expect(h1.getContentType()).toBe('h1');
  });

  it('コンテント生成関数から h2 見出しを生成できる', () => {
    const h2 = createContent({
      id: 1,
      type: 'h2',
      value: 'h2見出し',
    }) as Heading;
    expect(h2.getContent()).toBe('h2見出し');
    expect(h2.getLevel()).toBe(2);
    expect(h2.getId()).toBe(1);
    expect(h2.getContentType()).toBe('h2');
  });

  it('コンテント生成関数から h3 見出しを生成できる', () => {
    const h3 = createContent({
      id: 1,
      type: 'h3',
      value: 'h3見出し',
    }) as Heading;
    expect(h3.getContent()).toBe('h3見出し');
    expect(h3.getLevel()).toBe(3);
    expect(h3.getId()).toBe(1);
    expect(h3.getContentType()).toBe('h3');
  });
});

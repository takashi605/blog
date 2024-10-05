import type { Heading } from '@/entities/postContants/heading';
import { createH1, createH2, createH3 } from '@/entities/postContants/heading';

describe('エンティティ: 見出し', () => {
  it('h1 見出しを生成できる', () => {
    const heading: Heading = createH1('h1見出し');
    expect(heading.getText()).toBe('h1見出し');
    expect(heading.getLevel()).toBe(1);
  });

  it('h2 見出しを生成できる', () => {
    const heading: Heading = createH2('h2見出し');
    expect(heading.getText()).toBe('h2見出し');
    expect(heading.getLevel()).toBe(2);
  });

  it('h3 見出しを生成できる', () => {
    const heading: Heading = createH3('h3見出し');
    expect(heading.getText()).toBe('h3見出し');
    expect(heading.getLevel()).toBe(3);
  });
});

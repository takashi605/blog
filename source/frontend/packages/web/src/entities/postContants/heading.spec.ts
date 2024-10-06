import type { Heading } from '@/entities/postContants/heading';
import { createH1, createH2, createH3 } from '@/entities/postContants/heading';

describe('エンティティ: 見出し', () => {
  it('h1 見出しを生成できる', () => {
    const h1: Heading = createH1(1, 'h1見出し');
    expect(h1.getText()).toBe('h1見出し');
    expect(h1.getLevel()).toBe(1);
    expect(h1.getId()).toBe(1);
  });

  it('h2 見出しを生成できる', () => {
    const h2: Heading = createH2(1, 'h2見出し');
    expect(h2.getText()).toBe('h2見出し');
    expect(h2.getLevel()).toBe(2);
    expect(h2.getId()).toBe(1);
  });

  it('h3 見出しを生成できる', () => {
    const h3: Heading = createH3(1, 'h3見出し');
    expect(h3.getText()).toBe('h3見出し');
    expect(h3.getLevel()).toBe(3);
    expect(h3.getId()).toBe(1);
  });
});

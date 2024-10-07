import { createContent } from "@/entities/postContants/content";
import type { Heading } from "@/entities/postContants/heading";

describe('エンティティ: コンテント',() => {
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
})

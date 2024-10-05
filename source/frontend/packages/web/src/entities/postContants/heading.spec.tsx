import { createH1 } from "@/entities/postContants/heading";
import type { Heading } from "@/entities/postContants/heading";

describe('エンティティ: 見出し', () => {
  it('h1 見出しを生成できる', async () => {
    const heading:Heading = createH1("h1見出し");
    expect(heading.getText()).toBe('h1見出し');
    expect(heading.getLevel()).toBe(1);
  });
})

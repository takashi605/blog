import { createParagraph } from "@/entities/postContants/paragraph";

describe('エンティティ: 段落', () => {
  it('段落を生成できる', () => {
    const paragraph = createParagraph(1, '段落');

    expect(paragraph.getId()).toBe(1);
    expect(paragraph.getText()).toBe('段落');
  });
})

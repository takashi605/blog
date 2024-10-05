import { createParagraph } from "@/entities/postContants/paragraph";

describe('エンティティ: 段落', () => {
  it('段落を生成できる', () => {
    const paragraph = createParagraph('段落');
    expect(paragraph.getText()).toBe('段落');
  });
})

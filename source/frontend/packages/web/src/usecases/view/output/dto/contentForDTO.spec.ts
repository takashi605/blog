import { ParagraphToDTOStrategy } from '@/usecases/view/output/dto/contentForDTO';
import {
  ContentType,
  createContent,
} from 'entities/src/blogPost/postContents/content';

describe('contentForDTO', () => {
  it('ParagraphToDTOStrategy クラスを使って DTO を生成できる', () => {
    const content = createContent({
      id: 1,
      type: ContentType.Paragraph,
      value: '段落',
    });

    const dto = new ParagraphToDTOStrategy().toDTO(content);

    expect(dto.id).toBe(1);
    expect(dto.text).toBe('段落');
    expect(dto.type).toBe('paragraph');
  });
});

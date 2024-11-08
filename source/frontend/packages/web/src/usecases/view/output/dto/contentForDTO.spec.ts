import { createContentToDTOContext } from '@/usecases/view/output/dto/contentForDTO';
import {
  ContentType,
  createContent,
} from 'entities/src/blogPost/postContents/content';

describe('contentForDTO', () => {
  it('type「Paragraph」を持つコンテントを DTO に変換できる', () => {
    const content = createContent({
      id: 1,
      type: ContentType.Paragraph,
      value: '段落',
    });

    const context = createContentToDTOContext(content);

    const dto = context.toDTO();

    expect(dto.id).toBe(1);
    expect(dto.text).toBe('段落');
    expect(dto.type).toBe('paragraph');
  });

  it('type「h2」を持つコンテントを DTO に変換できる', () => {
    const content = createContent({
      id: 2,
      type: ContentType.H2,
      value: 'h2見出し',
    });

    const context = createContentToDTOContext(content);

    const dto = context.toDTO();

    expect(dto.id).toBe(2);
    expect(dto.text).toBe('h2見出し');
    expect(dto.type).toBe('h2');
  });
});

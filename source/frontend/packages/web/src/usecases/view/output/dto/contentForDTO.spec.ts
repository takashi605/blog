import {
  ContentToDTOContext,
  HeadingToDTOStrategy,
  ParagraphToDTOStrategy,
} from '@/usecases/view/output/dto/contentForDTO';
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

    const context = new ContentToDTOContext(
      new ParagraphToDTOStrategy(content),
    );

    const dto = context.toDTO();

    expect(dto.id).toBe(1);
    expect(dto.text).toBe('段落');
    expect(dto.type).toBe('paragraph');
  });

  it('HeadingToDTOStrategy クラスを使って DTO を生成できる', () => {
    const content = createContent({
      id: 2,
      type: ContentType.H2,
      value: 'h2見出し',
    });

    const context = new ContentToDTOContext(new HeadingToDTOStrategy(content));

    const dto = context.toDTO();

    expect(dto.id).toBe(2);
    expect(dto.text).toBe('h2見出し');
    expect(dto.type).toBe('h2');
  });
});

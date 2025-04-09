import { Code } from 'entities/src/blogPost/postContents/code';
import { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import { ImageContent } from 'entities/src/blogPost/postContents/image';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';
import { mockRichText } from 'entities/src/mockData/blogPost/mockBlogPost';
import { createContentToDTOContext } from '.';

describe('contentDTO', () => {
  it('type「Paragraph」を持つコンテントを DTO に変換できる', () => {
    const content = new Paragraph('1', mockRichText());

    const context = createContentToDTOContext(content);

    const dto = context.toDTO();

    expect(dto.id).toBe('1');
    expect(dto.text).toBeDefined();
    expect(dto.type).toBe('paragraph');
  });

  it('type「h2」を持つコンテントを DTO に変換できる', () => {
    const content = new H2('2', 'h2見出し');

    const context = createContentToDTOContext(content);

    const dto = context.toDTO();

    expect(dto.id).toBe('2');
    expect(dto.text).toBe('h2見出し');
    expect(dto.type).toBe('h2');
  });

  it('type「h3」を持つコンテントを DTO に変換できる', () => {
    const content = new H3('3', 'h3見出し');

    const context = createContentToDTOContext(content);

    const dto = context.toDTO();

    expect(dto.id).toBe('3');
    expect(dto.text).toBe('h3見出し');
    expect(dto.type).toBe('h3');
  });

  it('type「Image」を持つコンテントを DTO に変換できる', () => {
    const content = new ImageContent('4', 'path/to/image');

    const context = createContentToDTOContext(content);

    const dto = context.toDTO();

    expect(dto.id).toBe('4');
    expect(dto.path).toBe('path/to/image');
    expect(dto.type).toBe('image');
  });

  it('type「Code」を持つコンテントを DTO に変換できる', () => {
    const content = new Code(
      '5',
      'サンプルコード',
      'console.log("Hello, World!");',
      'javascript',
    );

    const context = createContentToDTOContext(content);

    const dto = context.toDTO();
    expect(dto.id).toBe('5');
    expect(dto.title).toBe('サンプルコード');
    expect(dto.code).toBe('console.log("Hello, World!");');
    expect(dto.language).toBe('javascript');
    expect(dto.type).toBe('code');
  });
});

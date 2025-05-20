import { ContentType } from 'entities/src/blogPost/postContents/content';
import { createUUIDv4 } from '../../utils/uuid';
import type { BlogPostDTO } from './blogPostDTO';
import { blogPostDTOToEntity } from './blogPostDTOToEntity';

describe('blogPostDTOToEntity', () => {
  it('DTO からエンティティに変換する', () => {
    const id = createUUIDv4();
    const dto: BlogPostDTO = {
      id,
      title: 'title',
      postDate: '2021-01-01',
      lastUpdateDate: '2021-01-02',
      thumbnail: {
        id: '535c8105-fd92-47b7-93ce-dc01b379ae66',
        path: 'path/to/thumbnail',
      },
      contents: [
        { id: createUUIDv4(), type: ContentType.H2, text: 'h2 text' },
        { id: createUUIDv4(), type: ContentType.H3, text: 'h3 text' },
        { id: createUUIDv4(), type: ContentType.Image, path: 'path/to/image' },
        {
          id: createUUIDv4(),
          type: ContentType.CodeBlock,
          title: 'サンプルコード',
          code: 'console.log("Hello World")',
          language: 'javascript',
        },
        {
          id: createUUIDv4(),
          type: ContentType.Paragraph,
          text: [
            { text: 'Hello', styles: { bold: false, inlineCode: false } },
            { text: 'World', styles: { bold: true, inlineCode: false } },
            {
              text: '!',
              styles: { bold: false, inlineCode: false },
              link: { url: 'https://example.com' },
            },
          ],
        },
      ],
    };
    const entity = blogPostDTOToEntity(dto);

    expect(entity).toHaveProperty('id', id);
    expect(entity).toHaveProperty('title', 'title');
    expect(entity).toHaveProperty('thumbnail');
    expect(entity).toHaveProperty('postDate');
    expect(entity).toHaveProperty('lastUpdateDate');
    expect(entity).toHaveProperty('contents');
  });
});

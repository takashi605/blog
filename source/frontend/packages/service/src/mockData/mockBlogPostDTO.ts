import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { BlogPostDTO } from '../blogPostService/dto/blogPostDTO';
import type { RichTextDTO } from '../blogPostService/dto/contentDTO';
import { createUUIDv4 } from '../utils/uuid';

// これを直接 import して使えばいい
export const mockBlogPostDTO: BlogPostDTO = {
  id: createUUIDv4(),
  title: '記事タイトル',
  postDate: '2021-01-01',
  lastUpdateDate: '2021-01-02',
  thumbnail: {
    id: '535c8105-fd92-47b7-93ce-dc01b379ae66',
    path: 'path/to/thumbnail',
  },
  contents: [
    { id: createUUIDv4(), type: ContentType.H2, text: 'h2見出し1' },
    { id: createUUIDv4(), type: ContentType.H3, text: 'h3見出し1' },
    {
      id: createUUIDv4(),
      type: ContentType.Paragraph,
      text: mockRichTextDTO(),
    },
    {
      id: createUUIDv4(),
      type: ContentType.Image,
      path: 'path/to/image',
    },
    {
      id: createUUIDv4(),
      type: ContentType.CodeBlock,
      title: 'サンプルコード',
      code: 'console.log("Hello, World!");',
      language: 'javascript',
    },
  ],
};

export function mockRichTextDTO(): RichTextDTO {
  return [
    {
      text: 'これは',
      styles: { bold: false },
    },
    {
      text: 'テストテキスト',
      styles: { bold: true },
    },
    {
      text: 'です',
      styles: { bold: false, inline: true },
    },
  ];
}

import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { BlogPostDTO } from '../blogPostService/dto/blogPostDTO';
import { createUUIDv4 } from '../utils/uuid';

export const mockBlogPostDTO: BlogPostDTO = {
  id: createUUIDv4(),
  title: '記事タイトル',
  postDate: '2021-01-01',
  lastUpdateDate: '2021-01-02',
  thumbnail: { path: 'path/to/thumbnail' },
  contents: [
    { id: createUUIDv4(), type: ContentType.H2, text: 'h2見出し1' },
    { id: createUUIDv4(), type: ContentType.H3, text: 'h3見出し1' },
    {
      id: createUUIDv4(),
      type: ContentType.Paragraph,
      text: mockRichTextForDTO(),
    },
  ],
};

export function mockRichTextForDTO() {
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
      styles: { bold: false },
    },
  ];
}

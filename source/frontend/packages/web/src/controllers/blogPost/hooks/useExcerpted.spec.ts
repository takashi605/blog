import { renderHook } from '@testing-library/react';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { ContentForDTO } from 'service/src/blogPostService/dto/contentDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { useExcerpted } from './useExcerpted';

describe('useExcerpted', () => {
  it('ブログ記事本文の DTO から最初の段落要素を抽出する', () => {
    const contentDTOMock: ContentForDTO[] = [
      {
        id: createUUIDv4(),
        type: ContentType.H2,
        text: 'h2見出し',
      },
      {
        id: createUUIDv4(),
        type: ContentType.Image,
        path: 'path/to/image',
      },
      {
        id: createUUIDv4(),
        type: ContentType.Paragraph,
        text: '段落1',
      },
      {
        id: createUUIDv4(),
        type: ContentType.H3,
        text: 'h3見出し',
      },
      {
        id: createUUIDv4(),
        type: ContentType.Paragraph,
        text: '段落2',
      },
    ];

    const { result } = renderHook(() => useExcerpted(contentDTOMock));
    expect(result.current).toBe('段落1');
  });
});

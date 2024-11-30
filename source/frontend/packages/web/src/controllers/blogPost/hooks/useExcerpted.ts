import type { ContentForDTO } from 'service/src/blogPostService/dto/contentDTO';

export function useExcerpted(contents: ReadonlyArray<ContentForDTO>): string {
  return contents.find((content) => content.type === 'paragraph')?.text ?? '';
}

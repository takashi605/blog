import type {
  ContentDTO,
  RichTextDTO,
} from 'service/src/blogPostService/dto/contentDTO';

// TODO 適切なロジックか見直す
export function useExcerpted(contents: ReadonlyArray<ContentDTO>): RichTextDTO {
  const richText =
    contents.find((content) => content.type === 'paragraph')?.text ?? [];
  return richText;
}

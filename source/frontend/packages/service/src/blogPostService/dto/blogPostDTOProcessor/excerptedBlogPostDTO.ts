import type { BlogPostDTO } from '../blogPostDTO';
import type { RichTextDTO } from '../contentDTO';

export function extractFirstParagraphText(dto: BlogPostDTO): string {
  const richText = extractFirstParagraph(dto);
  const excerptedText = richText.map((text) => text.text).join('');
  return excerptedText;
}

export function extractFirstParagraph(dto: BlogPostDTO): RichTextDTO {
  const firstParagraph = dto.contents.find(
    (content) => content.type === 'paragraph',
  );
  const richText = firstParagraph?.text ?? [];

  return richText;
}

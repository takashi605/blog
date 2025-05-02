import type { BlogPostDTO } from '../blogPostDTO';

export function extractFirstParagraphText(dto: BlogPostDTO): string {
  const firstParagraph = dto.contents.find(
    (content) => content.type === 'paragraph',
  );
  const richText = firstParagraph?.text ?? [];
  const excerptedText = richText.map((text) => text.text).join('');
  return excerptedText;
}

import type { TextNode } from 'lexical';
import type { RichTextDTO } from 'service/src/blogPostService/dto/contentDTO';

export function textNodeToDTO(textNode: TextNode): RichTextDTO {
  return [
    {
      text: textNode.getTextContent(),
      styles: {
        bold: textNode.hasFormat('bold'),
      },
    },
  ];
}

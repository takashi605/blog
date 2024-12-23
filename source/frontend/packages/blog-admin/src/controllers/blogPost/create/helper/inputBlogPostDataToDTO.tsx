import type { TextNode } from 'lexical';
import type { RichTextDTO } from 'service/src/blogPostService/dto/contentDTO';

export function textNodeToDTO(textNodes: TextNode[]): RichTextDTO {
  return textNodes.map((node) => ({
    text: node.getTextContent(),
    styles: {
      bold: node.hasFormat('bold'),
    },
  }));
}

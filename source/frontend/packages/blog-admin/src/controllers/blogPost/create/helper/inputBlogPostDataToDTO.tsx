import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { ElementNode, TextNode } from 'lexical';
import type {
  ParagraphDTO,
  RichTextDTO,
} from 'service/src/blogPostService/dto/contentDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';

export function paragraphNodeToDTO(paragraphNode: ElementNode): ParagraphDTO {
  if (paragraphNode.getType() !== 'paragraph') {
    throw new Error('paragraphNode ではありません');
  }
  const textNodes: TextNode[] = paragraphNode.getChildren().map((child) => {
    if (child.getType() !== 'text') {
      throw new Error('textNode ではありません');
    }
    return child as TextNode;
  });
  return {
    id: createUUIDv4(),
    type: ContentType.Paragraph,
    text: textNodeToDTO(textNodes),
  };
}

export function textNodeToDTO(textNodes: TextNode[]): RichTextDTO {
  return textNodes.map((node) => ({
    text: node.getTextContent(),
    styles: {
      bold: node.hasFormat('bold'),
    },
  }));
}

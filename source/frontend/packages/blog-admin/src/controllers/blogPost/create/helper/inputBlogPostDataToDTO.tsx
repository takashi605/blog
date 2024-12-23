import type { HeadingNode } from '@lexical/rich-text';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { ElementNode, TextNode } from 'lexical';
import type {
  H2DTO,
  H3DTO,
  ParagraphDTO,
  RichTextDTO,
} from 'service/src/blogPostService/dto/contentDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';

export function headingNodeToDTO(headingNode: HeadingNode): H2DTO | H3DTO {
  if (headingNode.getType() !== 'heading') {
    throw new Error('headingNode ではありません');
  }
  const textNodes: TextNode[] = extractTextNode(headingNode);
  const text = textNodes.map((node) => node.getTextContent()).join('');

  switch (headingNode.getTag()) {
    case 'h2':
      return {
        id: createUUIDv4(),
        type: ContentType.H2,
        text,
      } as H2DTO;
    case 'h3':
      return {
        id: createUUIDv4(),
        type: ContentType.H3,
        text,
      } as H3DTO;
    default:
      throw new Error('不正な見出しレベルです');
  }
}

export function paragraphNodeToDTO(paragraphNode: ElementNode): ParagraphDTO {
  if (paragraphNode.getType() !== 'paragraph') {
    throw new Error('paragraphNode ではありません');
  }
  const textNodes: TextNode[] = extractTextNode(paragraphNode);
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

// 以下ヘルパ関数
function extractTextNode(elementNode: ElementNode): TextNode[] {
  return elementNode.getChildren().map((child) => {
    if (child.getType() !== 'text') {
      throw new Error('textNode ではありません');
    }
    return child as TextNode;
  });
}

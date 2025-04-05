import type { HeadingNode } from '@lexical/rich-text';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { ElementNode, LexicalNode, TextNode } from 'lexical';
import type {
  ContentDTO,
  H2DTO,
  H3DTO,
  ImageContentDTO,
  ParagraphDTO,
  RichTextDTO,
} from 'service/src/blogPostService/dto/contentDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';
import type { ImageNode } from '../blogPostEditor/customNodes/ImageNode';

// TODO 各関数で ID を生成しているが、これはドメイン層で行うべきかもしれない

export function postContentAsFormDataToDTO(
  contents: LexicalNode[],
): ContentDTO[] {
  const contentsDTO: ContentDTO[] = [];
  contents.forEach((content) => {
    switch (content.getType()) {
      case 'heading':
        contentsDTO.push(headingNodeToDTO(content as HeadingNode));
        break;
      case 'paragraph':
        const elementNode = content as ElementNode;
        // elementNode の中に imageNode がある場合は imageContentDTO に変換する
        if (
          elementNode.getChildren().some((child) => child.getType() === 'image')
        ) {
          const imageNode = elementNode.getChildren().find(
            (child) => child.getType() === 'image',
          ) as ImageNode;
          contentsDTO.push(imageNodeToImageDTO(imageNode));
          return;
        }
        contentsDTO.push(paragraphNodeToDTO(content as ElementNode));
        break;
      default:
        throw new Error('不正なコンテンツタイプです');
    }
  });
  return contentsDTO;
}

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
    text: textNodeToRichTextDTO(textNodes),
  };
}

export function textNodeToRichTextDTO(textNodes: TextNode[]): RichTextDTO {
  return textNodes.map((node) => ({
    text: node.getTextContent(),
    styles: {
      bold: node.hasFormat('bold'),
    },
  }));
}

export function imageNodeToImageDTO(imageNode: ImageNode): ImageContentDTO {
  return {
    id: createUUIDv4(),
    type: ContentType.Image,
    path: imageNode.__src,
  };
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

/**
 * LexicalNodeからBlogPostContent型に変換するヘルパー関数
 *
 * postContentAsFormDataToDTO.tsを参考に、DTOを経由せずに
 * 直接API型（BlogPostContent）に変換します
 */

import type { LinkNode } from '@lexical/link';
import type { HeadingNode } from '@lexical/rich-text';
import type { ElementNode, LexicalNode, TextNode } from 'lexical';
import { createUUIDv4 } from 'service/src/utils/uuid';
import type { BlogPostContent } from 'shared-lib/src/api';
import type { CustomCodeNode } from '../blogPostEditor/plugins/customNodes/codeBlock/CustomCodeNode';
import type { ImageNode } from '../blogPostEditor/plugins/customNodes/image/ImageNode';

/**
 * LexicalNodeの配列をBlogPostContent配列に変換
 */
export function lexicalNodeToBlogPostContent(
  contents: LexicalNode[],
): BlogPostContent[] {
  const blogPostContents: BlogPostContent[] = [];

  contents.forEach((content) => {
    switch (content.getType()) {
      case 'heading':
        blogPostContents.push(
          headingNodeToBlogPostContent(content as HeadingNode),
        );
        break;
      case 'paragraph':
        const elementNode = content as ElementNode;
        // elementNode の中に imageNode がある場合は ImageBlock に変換する
        if (
          elementNode.getChildren().some((child) => child.getType() === 'image')
        ) {
          const imageNode = elementNode
            .getChildren()
            .find((child) => child.getType() === 'image') as ImageNode;
          blogPostContents.push(imageNodeToBlogPostContent(imageNode));
          return;
        }
        blogPostContents.push(
          paragraphNodeToBlogPostContent(content as ElementNode),
        );
        break;
      case 'code':
        const codeNode = content as CustomCodeNode;
        blogPostContents.push(codeNodeToBlogPostContent(codeNode));
        break;
      default:
        console.log('不正なコンテンツタイプです', content.getType());
        throw new Error('不正なコンテンツタイプです');
    }
  });

  return blogPostContents;
}

/**
 * HeadingNodeをH2Block/H3Blockに変換
 */
function headingNodeToBlogPostContent(
  headingNode: HeadingNode,
): BlogPostContent {
  if (headingNode.getType() !== 'heading') {
    throw new Error('headingNode ではありません');
  }

  const textNodes = extractTextNode(headingNode);
  const text = textNodes.map((node) => node.getTextContent()).join('');

  switch (headingNode.getTag()) {
    case 'h2':
      return {
        type: 'h2' as const,
        id: createUUIDv4(),
        text,
      };
    case 'h3':
      return {
        type: 'h3' as const,
        id: createUUIDv4(),
        text,
      };
    default:
      throw new Error('不正な見出しレベルです');
  }
}

/**
 * ElementNodeをParagraphBlockに変換
 */
function paragraphNodeToBlogPostContent(
  paragraphNode: ElementNode,
): BlogPostContent {
  if (paragraphNode.getType() !== 'paragraph') {
    throw new Error('paragraphNode ではありません');
  }

  const textNodes: (TextNode | LinkNode)[] = extractTextNode(paragraphNode);

  return {
    type: 'paragraph' as const,
    id: createUUIDv4(),
    text: textNodeToRichText(textNodes),
  };
}

/**
 * CustomCodeNodeをCodeBlockに変換
 */
function codeNodeToBlogPostContent(codeNode: CustomCodeNode): BlogPostContent {
  const lang = codeNode.getLanguage() ? codeNode.getLanguage() : '';
  const title = codeNode.getTitle();

  return {
    type: 'codeBlock' as const,
    id: createUUIDv4(),
    title,
    code: codeNode.getTextContent(),
    language: lang as string,
  };
}

/**
 * ImageNodeをImageBlockに変換
 */
function imageNodeToBlogPostContent(imageNode: ImageNode): BlogPostContent {
  return {
    type: 'image' as const,
    id: createUUIDv4(),
    path: imageNode.getSrc(),
  };
}

/**
 * TextNode/LinkNodeをRichText配列に変換
 */
function textNodeToRichText(
  textNodes: (TextNode | LinkNode)[],
): BlogPostContent extends { type: 'paragraph' }
  ? BlogPostContent['text']
  : never {
  return textNodes.map((node) => {
    if (node.getType() === 'text') {
      const textNode = node as TextNode;
      return {
        text: textNode.getTextContent(),
        styles: {
          bold: textNode.hasFormat('bold'),
          inlineCode: textNode.hasFormat('code'),
        },
        link: null,
      };
    } else if (node.getType() === 'link') {
      const linkNode = node as LinkNode;
      return {
        text: linkNode.getTextContent(),
        styles: {
          bold: false,
          inlineCode: false,
        },
        link: {
          url: linkNode.getURL(),
        },
      };
    }
    throw new Error('不正なノードタイプです');
  }) as BlogPostContent extends { type: 'paragraph' }
    ? BlogPostContent['text']
    : never;
}

/**
 * ElementNodeからTextNode/LinkNodeを抽出
 */
function extractTextNode(elementNode: ElementNode): (TextNode | LinkNode)[] {
  return elementNode.getChildren().map((child) => {
    if (!(child.getType() === 'text' || child.getType() === 'link')) {
      throw new Error(
        'TextNode || LinkNode ではないデータを抽出しようとしました',
      );
    }
    return child as TextNode | LinkNode;
  });
}

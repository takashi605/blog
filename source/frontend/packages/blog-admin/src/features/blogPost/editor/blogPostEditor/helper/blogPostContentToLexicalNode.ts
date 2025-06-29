/**
 * BlogPostContent型からLexicalNodeに変換するヘルパー関数
 *
 * APIから取得したBlogPostデータをLexicalエディタの初期値として設定するために使用
 */

import { $createLinkNode } from '@lexical/link';
import { $createHeadingNode } from '@lexical/rich-text';
import {
  $createParagraphNode,
  $createTextNode,
  type LexicalNode,
  type TextFormatType,
} from 'lexical';
import type { BlogPostContent } from 'shared-lib/src/api';
import { $createCustomCodeNode } from '../plugins/customNodes/codeBlock/CustomCodeNode';
import { $createImageNode } from '../plugins/customNodes/image/ImageNode';

/**
 * BlogPostContent配列をLexicalNode配列に変換
 */
export function blogPostContentsToLexicalNodes(
  contents: BlogPostContent[],
): LexicalNode[] {
  return contents.map((content) => {
    switch (content.type) {
      case 'h2': {
        const heading = $createHeadingNode('h2');
        heading.append($createTextNode(content.text));
        return heading; // 親ノードを返す
      }

      case 'h3': {
        const heading = $createHeadingNode('h3');
        heading.append($createTextNode(content.text));
        return heading; // 親ノードを返す
      }

      case 'paragraph':
        return createParagraphNode(content);

      case 'image': {
        const paragraph = $createParagraphNode();
        paragraph.append(
          $createImageNode({
            src: content.path,
            altText: '',
          }),
        );
        return paragraph; // 親ノードを返す
      }

      case 'codeBlock':
        return createCodeBlockNode(content);

      default:
        // Never型のチェック（全てのケースが網羅されているか確認）
        const _exhaustiveCheck: never = content;
        throw new Error(
          `不明なコンテンツタイプ: ${JSON.stringify(_exhaustiveCheck)}`,
        );
    }
  });
}

/**
 * ParagraphブロックをLexicalのParagraphNodeに変換
 */
function createParagraphNode(
  content: Extract<BlogPostContent, { type: 'paragraph' }>,
): LexicalNode {
  const paragraphNode = $createParagraphNode();

  content.text.forEach((richText) => {
    if (richText.link) {
      // リンクノードの作成
      const linkNode = $createLinkNode(richText.link.url);
      const textNode = $createTextNode(richText.text);

      // スタイルの適用
      if (richText.styles.bold) {
        textNode.setFormat('bold');
      }
      if (richText.styles.inlineCode) {
        textNode.setFormat('code');
      }

      linkNode.append(textNode);
      paragraphNode.append(linkNode);
    } else {
      // 通常のテキストノード
      const textNode = $createTextNode(richText.text);

      // 複数のフォーマットを同時に適用
      const formats: TextFormatType[] = [];
      if (richText.styles.bold) {
        formats.push('bold');
      }
      if (richText.styles.inlineCode) {
        formats.push('code');
      }

      // フォーマットの適用
      formats.forEach((format) => {
        textNode.setFormat(format);
      });

      paragraphNode.append(textNode);
    }
  });

  return paragraphNode;
}

/**
 * CodeBlockをLexicalのCustomCodeNodeに変換
 */
function createCodeBlockNode(
  content: Extract<BlogPostContent, { type: 'codeBlock' }>,
): LexicalNode {
  // CustomCodeNodeを使用
  const codeNode = $createCustomCodeNode(
    content.language || 'text',
    content.title || 'サンプルコード',
  );

  // コード内容を設定
  const textNode = $createTextNode(content.code);
  codeNode.append(textNode);

  return codeNode;
}

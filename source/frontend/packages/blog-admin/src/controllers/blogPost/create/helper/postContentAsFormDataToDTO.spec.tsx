import { $createCodeNode, CodeNode } from '@lexical/code';
import { $createHeadingNode, HeadingNode } from '@lexical/rich-text';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { LexicalEditor, LexicalNode } from 'lexical';
import { $createParagraphNode, $createTextNode, createEditor } from 'lexical';
import type {
  ImageContentDTO,
  RichTextDTO,
} from 'service/src/blogPostService/dto/contentDTO';
import {
  $createImageNode,
  ImageNode,
} from '../blogPostEditor/plugins/customNodes/image/ImageNode';
import {
  headingNodeToDTO,
  imageNodeToImageDTO,
  paragraphNodeToDTO,
  postContentAsFormDataToDTO,
  textNodeToRichTextDTO,
} from './postContentAsFormDataToDTO';

describe('typedBlogPostToDTO', () => {
  it('入力されたブログ記事コンテンツデータを DTO に変換する', () => {
    const editor = createTextEditor();
    editor.update(() => {
      const testNodes = createTestNodes();
      const contentDTO = postContentAsFormDataToDTO(testNodes);
      expect(contentDTO).toEqual([
        {
          id: expect.any(String),
          type: 'h2',
          text: '見出し2',
        },
        {
          id: expect.any(String),
          type: 'h3',
          text: '見出し3',
        },
        {
          id: expect.any(String),
          type: ContentType.Image,
          path: 'http://example.com/test.png',
        },
        {
          id: expect.any(String),
          type: 'paragraph',
          text: [
            { text: 'Hello', styles: { bold: false } },
            { text: 'World', styles: { bold: true } },
          ],
        },
        {
          id: expect.any(String),
          type: 'codeBlock',
          title: 'サンプルコード',
          code: 'console.log("Hello World")',
          language: 'javascript',
        },
      ]);
    });
    // テスト用のノードを作成するヘルパ関数
    function createTestNodes(): LexicalNode[] {
      const h2Node = $createHeadingNode('h2');
      h2Node.append($createTextNode('見出し2'));

      const h3Node = $createHeadingNode('h3');
      h3Node.append($createTextNode('見出し3'));

      const imageNode = $createImageNode({
        altText: 'testAltText',
        height: 100,
        width: 100,
        src: 'http://example.com/test.png',
      });
      const imageInParagraphNode = $createParagraphNode();
      imageInParagraphNode.append(imageNode);

      const paragraphNode = $createParagraphNode();
      paragraphNode.append(
        $createTextNode('Hello'),
        $createTextNode('World').setFormat('bold'),
      );
      const codeNode = $createCodeNode('javascript');
      const textNode = $createTextNode('console.log("Hello World")');
      codeNode.append(textNode);

      const nodeArray: LexicalNode[] = [
        h2Node,
        h3Node,
        imageInParagraphNode,
        paragraphNode,
        codeNode,
      ];
      return nodeArray;
    }
  });

  it('自作 Node である imageNode を DTO に変換する', () => {
    const editor = createTextEditor();

    editor.update(() => {
      const imageNode = $createImageNode({
        altText: 'testAltText',
        height: 100,
        width: 100,
        src: 'http://example.com/test.png',
      });
      const imageDTO: ImageContentDTO = imageNodeToImageDTO(imageNode);

      const expectedImageDTO: ImageContentDTO = {
        id: expect.any(String),
        type: ContentType.Image,
        path: 'http://example.com/test.png',
      };
      expect(imageDTO).toEqual(expectedImageDTO);
    });
  });
  it('textNode をリッチテキスト DTO に変換する', () => {
    const editor = createTextEditor();

    editor.update(() => {
      const normalText = $createTextNode('normalText');
      const boldText = $createTextNode('boldText').setFormat('bold');
      const normalTextDTO: RichTextDTO = textNodeToRichTextDTO([
        normalText,
        boldText,
      ]);
      expect(normalTextDTO).toEqual([
        { text: 'normalText', styles: { bold: false } },
        { text: 'boldText', styles: { bold: true } },
      ]);
    });
  });

  it('paragraphNode を段落 DTO に変換する', () => {
    const editor = createTextEditor();

    editor.update(() => {
      const paragraphNode = $createParagraphNode();
      paragraphNode.append(
        $createTextNode('Hello'),
        $createTextNode('World').setFormat('bold'),
      );

      const paragraphDTO = paragraphNodeToDTO(paragraphNode);
      expect(paragraphDTO).toEqual({
        id: expect.any(String),
        type: 'paragraph',
        text: [
          { text: 'Hello', styles: { bold: false } },
          { text: 'World', styles: { bold: true } },
        ],
      });
    });
  });

  it('HeadingNode を見出し DTO に変換する', () => {
    const editor = createTextEditor();

    editor.update(() => {
      const h2Node = $createHeadingNode('h2');
      h2Node.append($createTextNode('見出し2'));
      const h2DTO = headingNodeToDTO(h2Node);

      expect(h2DTO).toEqual({
        id: expect.any(String),
        type: 'h2',
        text: '見出し2',
      });

      const h3Node = $createHeadingNode('h3');
      h3Node.append($createTextNode('見出し3'));
      const h3DTO = headingNodeToDTO(h3Node);

      expect(h3DTO).toEqual({
        id: expect.any(String),
        type: 'h3',
        text: '見出し3',
      });
    });
  });
});

// 以下ヘルパ関数
function createTextEditor(): LexicalEditor {
  const config = {
    namespace: 'testEditor',
    theme: {},
    onError: (e: Error) => {
      throw e;
    },
    nodes: [HeadingNode, ImageNode, CodeNode],
  };

  return createEditor(config);
}

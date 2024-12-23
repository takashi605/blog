import type { LexicalEditor } from 'lexical';
import { $createTextNode, createEditor } from 'lexical';
import type { RichTextDTO } from 'service/src/blogPostService/dto/contentDTO';
import { textNodeToDTO } from './inputBlogPostDataToDTO';

// function createTestNodes(): LexicalNode[] {
//   const h2Node = $createHeadingNode('h2');
//   h2Node.append($createTextNode('見出し2'));

//   const h3Node = $createHeadingNode('h3');
//   h3Node.append($createTextNode('見出し3'));

//   const paragraphNode = $createParagraphNode();
//   paragraphNode.append($createTextNode('Hello'), $createTextNode('World'));

//   const nodeArray: LexicalNode[] = [h2Node, h3Node, paragraphNode];
//   return nodeArray;
// }

describe('typedBlogPostToDTO', () => {
  it('textNode をリッチテキスト DTO に変換する', () => {
    const editor = createTextEditor();

    editor.update(() => {
      const normalText = $createTextNode('normalText');
      const normalTextDTO: RichTextDTO = textNodeToDTO(normalText);
      expect(normalTextDTO).toEqual([
        { text: 'normalText', styles: { bold: false } },
      ]);

      const boldText = $createTextNode('boldText').setFormat('bold');
      const boldTextDTO: RichTextDTO = textNodeToDTO(boldText);
      expect(boldTextDTO).toEqual([{ text: 'boldText', styles: { bold: true } }]);
    });
  });
  // it('入力されたブログ記事コンテンツデータを DTO に変換する', () => {
  //   const config = {
  //     namespace: 'testEditor',
  //     theme: {},
  //     onError: console.error,
  //   };

  //   const editor = createEditor(config);
  //   editor.update(() => {
  //     const root = $getRoot();
  //     const testNodes = createTestNodes();
  //     root.append(...testNodes);
  //   });

  //   editor.getEditorState().read(() => {
  //     const root = $getRoot();
  //     const children = root.getChildren();
  //     const contentDTO = typedBlogPostContentToDTO(children);

  //     expect(contentDTO).toEqual([
  //       { type: 'h2', text: '見出し2' },
  //       { type: 'h3', text: '見出し3' },
  //       { type: 'paragraph', text: 'HelloWorld' },
  //     ]);
  //   });
  // });
});

// 以下ヘルパ関数
function createTextEditor(): LexicalEditor {
  const config = {
    namespace: 'testEditor',
    theme: {},
    onError: (e: Error) => {
      throw e;
    },
  };

  return createEditor(config);
}

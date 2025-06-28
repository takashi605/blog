/**
 * BlogPostContent→LexicalNode変換関数のテスト
 */

import { $createLinkNode } from '@lexical/link';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createParagraphNode, $createTextNode } from 'lexical';
import type { BlogPostContent } from 'shared-lib/src/api';
import { $createCustomCodeNode } from '../blogPostEditor/plugins/customNodes/codeBlock/CustomCodeNode';
import { $createImageNode } from '../blogPostEditor/plugins/customNodes/image/ImageNode';
import { blogPostContentsToLexicalNodes } from './blogPostContentToLexicalNode';
import { mockBlogPost } from './mockBlogPostData';

// Lexicalモジュールのモック
jest.mock('@lexical/rich-text', () => ({
  $createHeadingNode: jest.fn().mockImplementation(() => ({
    getType: () => 'heading',
    append: jest.fn().mockReturnThis(),
  })),
}));

jest.mock('lexical', () => ({
  $createParagraphNode: jest.fn().mockImplementation(() => ({
    getType: () => 'paragraph',
    append: jest.fn().mockReturnThis(),
  })),
  $createTextNode: jest.fn().mockImplementation(() => ({
    getType: () => 'text',
    setFormat: jest.fn().mockReturnThis(),
  })),
}));

jest.mock('@lexical/link', () => ({
  $createLinkNode: jest.fn().mockImplementation(() => ({
    getType: () => 'link',
    append: jest.fn().mockReturnThis(),
  })),
}));

jest.mock(
  '../blogPostEditor/plugins/customNodes/codeBlock/CustomCodeNode',
  () => ({
    $createCustomCodeNode: jest.fn().mockImplementation(() => ({
      getType: () => 'code',
      append: jest.fn().mockReturnThis(),
    })),
  }),
);

jest.mock('../blogPostEditor/plugins/customNodes/image/ImageNode', () => ({
  $createImageNode: jest.fn().mockImplementation(() => ({
    getType: () => 'image',
  })),
}));

describe('blogPostContentToLexicalNode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('blogPostContentsToLexicalNodes', () => {
    it('h2ブロックを正しく変換する', () => {
      const h2Content: BlogPostContent = {
        type: 'h2',
        id: 'test-id',
        text: 'テスト見出し',
      };

      const result = blogPostContentsToLexicalNodes([h2Content]);

      expect(result).toHaveLength(1);
      expect($createHeadingNode).toHaveBeenCalledWith('h2');
      expect($createTextNode).toHaveBeenCalledWith('テスト見出し');
    });

    it('h3ブロックを正しく変換する', () => {
      const h3Content: BlogPostContent = {
        type: 'h3',
        id: 'test-id',
        text: 'テスト小見出し',
      };

      const result = blogPostContentsToLexicalNodes([h3Content]);

      expect(result).toHaveLength(1);
      expect($createHeadingNode).toHaveBeenCalledWith('h3');
      expect($createTextNode).toHaveBeenCalledWith('テスト小見出し');
    });

    it('paragraphブロックを正しく変換する', () => {
      const paragraphContent: BlogPostContent = {
        type: 'paragraph',
        id: 'test-id',
        text: [
          {
            text: '通常のテキスト',
            styles: { bold: false, inlineCode: false },
            link: null,
          },
          {
            text: '太字のテキスト',
            styles: { bold: true, inlineCode: false },
            link: null,
          },
        ],
      };

      const result = blogPostContentsToLexicalNodes([paragraphContent]);

      expect(result).toHaveLength(1);
      expect($createParagraphNode).toHaveBeenCalled();
      expect($createTextNode).toHaveBeenCalledWith('通常のテキスト');
      expect($createTextNode).toHaveBeenCalledWith('太字のテキスト');
    });

    it('リンクを含むparagraphブロックを正しく変換する', () => {
      const paragraphWithLink: BlogPostContent = {
        type: 'paragraph',
        id: 'test-id',
        text: [
          {
            text: 'リンクテキスト',
            styles: { bold: false, inlineCode: false },
            link: {
              url: 'https://example.com',
            },
          },
        ],
      };

      const result = blogPostContentsToLexicalNodes([paragraphWithLink]);

      expect(result).toHaveLength(1);
      expect($createParagraphNode).toHaveBeenCalled();
      expect($createLinkNode).toHaveBeenCalledWith('https://example.com');
      expect($createTextNode).toHaveBeenCalledWith('リンクテキスト');
    });

    it('imageブロックを正しく変換する', () => {
      const imageContent: BlogPostContent = {
        type: 'image',
        id: 'test-id',
        path: '/images/test.jpg',
      };

      const result = blogPostContentsToLexicalNodes([imageContent]);

      expect(result).toHaveLength(1);
      expect($createParagraphNode).toHaveBeenCalled();
      expect($createImageNode).toHaveBeenCalledWith({
        src: '/images/test.jpg',
        altText: '',
      });
    });

    it('codeBlockを正しく変換する', () => {
      const codeBlockContent: BlogPostContent = {
        type: 'codeBlock',
        id: 'test-id',
        title: 'テストコード',
        code: 'console.log("Hello, World!");',
        language: 'javascript',
      };

      const result = blogPostContentsToLexicalNodes([codeBlockContent]);

      expect(result).toHaveLength(1);
      expect($createCustomCodeNode).toHaveBeenCalledWith(
        'javascript',
        'テストコード',
      );
      expect($createTextNode).toHaveBeenCalledWith(
        'console.log("Hello, World!");',
      );
    });

    it('複数のコンテンツブロックを正しく変換する', () => {
      const multipleContents: BlogPostContent[] = [
        {
          type: 'h2',
          id: 'h2-id',
          text: '見出し',
        },
        {
          type: 'paragraph',
          id: 'p-id',
          text: [
            {
              text: '段落テキスト',
              styles: { bold: false, inlineCode: false },
              link: null,
            },
          ],
        },
      ];

      const result = blogPostContentsToLexicalNodes(multipleContents);

      expect(result).toHaveLength(2);
      expect($createHeadingNode).toHaveBeenCalledWith('h2');
      expect($createParagraphNode).toHaveBeenCalled();
    });

    it('モックデータを正しく変換する', () => {
      const result = blogPostContentsToLexicalNodes(mockBlogPost.contents);

      // モックデータの全コンテンツが変換されることを確認
      expect(result).toHaveLength(mockBlogPost.contents.length);

      // 各種ノード作成関数が呼び出されていることを確認
      expect($createHeadingNode).toHaveBeenCalled();
      expect($createParagraphNode).toHaveBeenCalled();
      expect($createCustomCodeNode).toHaveBeenCalled();
      expect($createImageNode).toHaveBeenCalled();
    });

    it('不明なコンテンツタイプでエラーを投げる', () => {
      const invalidContent = {
        type: 'unknown',
        id: 'test-id',
      } as unknown as BlogPostContent;

      expect(() => {
        blogPostContentsToLexicalNodes([invalidContent]);
      }).toThrow('不明なコンテンツタイプ');
    });

    it('言語が指定されていないcodeBlockを正しく変換する', () => {
      const codeBlockWithoutLanguage: BlogPostContent = {
        type: 'codeBlock',
        id: 'test-id',
        title: 'テストコード',
        code: 'some code',
        language: '',
      };

      const result = blogPostContentsToLexicalNodes([codeBlockWithoutLanguage]);

      expect(result).toHaveLength(1);
      expect($createCustomCodeNode).toHaveBeenCalledWith(
        'text',
        'テストコード',
      );
    });

    it('タイトルが指定されていないcodeBlockを正しく変換する', () => {
      const codeBlockWithoutTitle: BlogPostContent = {
        type: 'codeBlock',
        id: 'test-id',
        title: '',
        code: 'some code',
        language: 'javascript',
      };

      const result = blogPostContentsToLexicalNodes([codeBlockWithoutTitle]);

      expect(result).toHaveLength(1);
      expect($createCustomCodeNode).toHaveBeenCalledWith(
        'javascript',
        'サンプルコード',
      );
    });
  });
});

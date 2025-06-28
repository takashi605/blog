/**
 * BlogPostEditorの開発用モックデータ
 */

import type { BlogPost } from 'shared-lib/src/api';

export const mockBlogPost: BlogPost = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Lexicalエディタの実装ガイド',
  thumbnail: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    path: '/images/sample-thumbnail.jpg',
  },
  postDate: '2024-01-15',
  lastUpdateDate: '2024-01-20',
  publishedDate: '2024-01-16',
  contents: [
    {
      type: 'h2',
      id: '550e8400-e29b-41d4-a716-446655440002',
      text: 'はじめに',
    },
    {
      type: 'paragraph',
      id: '550e8400-e29b-41d4-a716-446655440003',
      text: [
        {
          text: 'このブログ記事では、',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
        {
          text: 'Lexical',
          styles: { bold: true, inlineCode: false },
          link: null,
        },
        {
          text: 'エディタの実装方法について説明します。',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
      ],
    },
    {
      type: 'h3',
      id: '550e8400-e29b-41d4-a716-446655440004',
      text: 'Lexicalとは',
    },
    {
      type: 'paragraph',
      id: '550e8400-e29b-41d4-a716-446655440005',
      text: [
        {
          text: 'Lexicalは',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
        {
          text: 'Meta社が開発',
          styles: { bold: false, inlineCode: false },
          link: {
            url: 'https://lexical.dev/',
          },
        },
        {
          text: 'したリッチテキストエディタフレームワークです。',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
        {
          text: 'React',
          styles: { bold: false, inlineCode: true },
          link: null,
        },
        {
          text: 'との親和性が高く、カスタマイズ性に優れています。',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
      ],
    },
    {
      type: 'h2',
      id: '550e8400-e29b-41d4-a716-446655440006',
      text: '実装手順',
    },
    {
      type: 'codeBlock',
      id: '550e8400-e29b-41d4-a716-446655440007',
      title: 'パッケージのインストール',
      code: 'npm install lexical @lexical/react',
      language: 'bash',
    },
    {
      type: 'paragraph',
      id: '550e8400-e29b-41d4-a716-446655440008',
      text: [
        {
          text: '以下は基本的な実装例です：',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
      ],
    },
    {
      type: 'codeBlock',
      id: '550e8400-e29b-41d4-a716-446655440009',
      title: 'エディタコンポーネントの実装',
      code: `import { $getRoot, $getSelection } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    onError: (error) => console.error(error),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
      />
    </LexicalComposer>
  );
}`,
      language: 'typescript',
    },
    {
      type: 'image',
      id: '550e8400-e29b-41d4-a716-446655440010',
      path: '/images/lexical-editor-preview.png',
    },
    {
      type: 'h3',
      id: '550e8400-e29b-41d4-a716-446655440011',
      text: 'カスタムノードの追加',
    },
    {
      type: 'paragraph',
      id: '550e8400-e29b-41d4-a716-446655440012',
      text: [
        {
          text: 'Lexicalでは',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
        {
          text: 'カスタムノード',
          styles: { bold: true, inlineCode: false },
          link: null,
        },
        {
          text: 'を作成することで、独自の要素を追加できます。例えば、',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
        {
          text: 'ImageNode',
          styles: { bold: false, inlineCode: true },
          link: null,
        },
        {
          text: 'や',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
        {
          text: 'CodeNode',
          styles: { bold: false, inlineCode: true },
          link: null,
        },
        {
          text: 'などを実装できます。',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
      ],
    },
    {
      type: 'h2',
      id: '550e8400-e29b-41d4-a716-446655440013',
      text: 'まとめ',
    },
    {
      type: 'paragraph',
      id: '550e8400-e29b-41d4-a716-446655440014',
      text: [
        {
          text: 'Lexicalは非常に強力なエディタフレームワークです。',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
        {
          text: '詳細なドキュメント',
          styles: { bold: false, inlineCode: false },
          link: {
            url: 'https://lexical.dev/docs/intro',
          },
        },
        {
          text: 'を参考に、ぜひ実装してみてください。',
          styles: { bold: false, inlineCode: false },
          link: null,
        },
      ],
    },
  ],
};

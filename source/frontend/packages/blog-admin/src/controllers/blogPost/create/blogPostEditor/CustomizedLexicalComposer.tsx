import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ParagraphNode, TextNode } from 'lexical';
import styles from 'shared-ui/src/blogPost/styles/blogPostViewer.module.scss';
import { ImageNode } from './plugins/customNodes/image/ImageNode';

const theme = {
  code: 'editor-code',
  heading: {
    h2: styles.h2,
    h3: styles.h3,
  },
  paragraph: styles.paragraph,
};

type CustomizedLexicalComposerProps = {
  children: React.ReactNode;
};

function CustomizedLexicalComposer({
  children,
}: CustomizedLexicalComposerProps) {
  const initialConfig = {
    namespace: 'MyEditor',
    // TODO 適切なエラーハンドリングを実装する
    onError: (error: Error) => {
      console.error(error);
    },
    // node を色々と追加しないと MarkDown が動かないらしい： https://zenn.dev/ikenohi/scraps/e2832cbcb566a2
    nodes: [
      LinkNode,
      AutoLinkNode,
      ListNode,
      ListItemNode,
      HorizontalRuleNode,
      CodeNode,
      CodeHighlightNode,
      HeadingNode,
      LinkNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      ParagraphNode,
      TextNode,
      ImageNode,
    ],
    theme,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>{children}</LexicalComposer>
  );
}

export default CustomizedLexicalComposer;

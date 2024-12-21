import { CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ParagraphNode, TextNode } from 'lexical';

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
    nodes: [
      LinkNode,
      AutoLinkNode,
      ListNode,
      ListItemNode,
      HorizontalRuleNode,
      CodeNode,
      HeadingNode,
      LinkNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      ParagraphNode,
      TextNode,
    ],
    theme: {},
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>{children}</LexicalComposer>
  );
}

export default CustomizedLexicalComposer;

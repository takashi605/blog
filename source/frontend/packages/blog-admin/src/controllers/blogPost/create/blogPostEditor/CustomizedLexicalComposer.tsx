import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ParagraphNode, TextNode } from 'lexical';

type CustomizedLexicalComposerProps = {
  children: React.JSX.Element;
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
    nodes: [ParagraphNode, TextNode],
    theme: {},
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>{children}</LexicalComposer>
  );
}

export default CustomizedLexicalComposer;

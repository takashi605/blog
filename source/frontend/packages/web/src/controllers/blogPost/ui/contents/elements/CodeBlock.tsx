import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { CodeBlockDTO } from 'service/src/blogPostService/dto/contentDTO';

type CodeBlockProps = {
  codeBlockData: CodeBlockDTO;
};

function CodeBlock({ codeBlockData }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={codeBlockData.language}
      PreTag="div"
    >
      {codeBlockData.code}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;

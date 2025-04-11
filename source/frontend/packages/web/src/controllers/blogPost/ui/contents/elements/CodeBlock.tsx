import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { CodeBlockDTO } from 'service/src/blogPostService/dto/contentDTO';
import { MdCopyAll } from 'react-icons/md';
import styles from './codeBlock.module.scss'
import CopyButton from '../../../../../components/buttons/CopyButton';

type CodeBlockProps = {
  codeBlockData: CodeBlockDTO;
};

function CodeBlock({ codeBlockData }: CodeBlockProps) {
  return (
    <div className={styles.codeBlockWrapper}>
      <div className={styles.copyIcon}>
        <CopyButton textForCopy={codeBlockData.code}>
          <MdCopyAll size="28px"/>
        </CopyButton>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={codeBlockData.language}
        PreTag="div"
      >
        {codeBlockData.code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;

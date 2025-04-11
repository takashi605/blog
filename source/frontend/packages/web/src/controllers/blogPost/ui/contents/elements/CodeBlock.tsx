import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { CodeBlockDTO } from 'service/src/blogPostService/dto/contentDTO';
import { MdCopyAll } from 'react-icons/md';
import { FaRegSquareCheck } from 'react-icons/fa6';
import styles from './codeBlock.module.scss'
import CopyButton from '../../../../../components/buttons/CopyButton';

type CodeBlockProps = {
  codeBlockData: CodeBlockDTO;
};

function CodeBlock({ codeBlockData }: CodeBlockProps) {
  return (
    <div className={styles.codeBlockWrapper}>
      <div className={styles.copyIcon}>
        <CopyButton
          label={<MdCopyAll size="28px" color="#fff" />}
          successLabel={<FaRegSquareCheck size="28px" color="#5cb85c" />}
          textForCopy={codeBlockData.code}
        />
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

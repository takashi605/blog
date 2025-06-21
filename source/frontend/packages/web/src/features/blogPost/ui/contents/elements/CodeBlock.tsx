import { FaRegSquareCheck } from 'react-icons/fa6';
import { MdCopyAll } from 'react-icons/md';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { components } from 'shared-lib/src/generated/api-types';
import viewerStyles from 'shared-ui/src/blogPost/styles/blogPostViewer.module.scss';
import CopyButton from '../../../../../components/buttons/CopyButton';
import styles from './codeBlock.module.scss';

type CodeBlock = components['schemas']['CodeBlock'];

type CodeBlockProps = {
  codeBlockData: CodeBlock;
};

function CodeBlock({ codeBlockData }: CodeBlockProps) {
  return (
    <>
      <span className={styles.codeTitle}>{codeBlockData.title}</span>
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
          useInlineStyles={false}
          language={codeBlockData.language}
          PreTag="div"
          className={viewerStyles.codeBlock}
        >
          {codeBlockData.code}
        </SyntaxHighlighter>
      </div>
    </>
  );
}

export default CodeBlock;

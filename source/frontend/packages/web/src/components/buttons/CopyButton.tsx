import { useState } from 'react';

type Props = {
  /** コピーしたい文字列 */
  textForCopy: string;
  children: React.ReactNode;
};

export default function CopyButton({ textForCopy, children }: Props) {
  const [copyResultMessage, setCopySuccess] = useState('');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textForCopy);
      setCopySuccess('Copied!');
    } catch (err) {
      setCopySuccess('コピーに失敗しました...');
    }
  };

  return (
    <button type="button" aria-label="copy button" onClick={copyToClipboard}>
      {children}
      {copyResultMessage && (
        <span style={{ marginLeft: '8px', color: 'green' }}>
          {copyResultMessage}
        </span>
      )}
    </button>
  );
}

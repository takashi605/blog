'use client';
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
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textForCopy);
      } else {
        // 開発環境だと Clipboard API が使えないため、execCommand を使う
        // フォールバック (execCommand)
        const textarea = document.createElement('textarea');
        textarea.value = textForCopy;

        // 画面に見えないように配置
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '-9999px';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopySuccess('Copied!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopySuccess('コピーに失敗しました...');
    }
  };

  return (
    <button type="button" aria-label="copy button" onClick={copyToClipboard}>
      {children}
      {copyResultMessage && (
        <span
          style={{ marginLeft: '8px', color: 'green', position: 'absolute' }}
        >
          {copyResultMessage}
        </span>
      )}
    </button>
  );
}

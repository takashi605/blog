'use client';
import React, { useState } from 'react';
import styles from './copyButton.module.scss';

type Props = {
  /** コピーしたい文字列 */
  textForCopy: string;
  label: React.ReactNode;
  successLabel?: React.ReactNode;
};

export default function CopyButton({
  textForCopy,
  label,
  successLabel = textForCopy,
}: Props) {
  const [copyResultMessage, setCopyResultMessage] = useState('');

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
      setCopyResultMessage('Copied!');

      setTimeout(() => setCopyResultMessage(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyResultMessage('コピーに失敗しました...');
    }
  };

  return (
    <button
      className={styles.copyButton}
      type="button"
      aria-label="copy-button"
      onClick={copyToClipboard}
    >
      {copyResultMessage ? successLabel : label}
      {copyResultMessage && (
        <span className={styles.successMessage}>{copyResultMessage}</span>
      )}
    </button>
  );
}

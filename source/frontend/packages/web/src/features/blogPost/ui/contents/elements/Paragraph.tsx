import Link from 'next/link';
import React, { memo } from 'react';
import type { components } from 'shared-lib/src/generated/api-types';
import { createUUIDv4 } from 'shared-lib/src/utils/uuid';
import styles from 'shared-ui/src/blogPost/styles/blogPostViewer.module.scss';

type RichText = components['schemas']['RichText'];

type ParagraphProps = {
  richText: RichText[];
};

// TODO key に UUID を使うのは適切か検討
export function Paragraph({ richText }: ParagraphProps) {
  return (
    <p className={styles.paragraph}>
      {richText.length === 0 && <br />}
      {richText.map((text) => (
        <span key={createUUIDv4()}>
          <StyledText richText={text} />
        </span>
      ))}
    </p>
  );
}

export default memo(Paragraph);

function StyledText({ richText }: { richText: RichText }) {
  let text = richText.text as React.ReactNode;
  if (richText.styles?.bold) {
    text = <strong>{text}</strong>;
  }
  if (richText.styles?.inlineCode) {
    text = <code className={styles.inlineCodeText}>{text}</code>;
  }

  if (richText.link) {
    text = (
      <Link href={richText.link.url} className={styles.linkText}>
        {text}
      </Link>
    );
  }
  return <span key={createUUIDv4()}>{text}</span>;
}

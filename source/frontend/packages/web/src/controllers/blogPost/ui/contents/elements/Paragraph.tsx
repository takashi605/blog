import React, { memo } from 'react';
import type { RichTextDTO } from 'service/src/blogPostService/dto/contentDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';
import styles from 'shared-ui/src/blogPost/styles/blogPostViewer.module.scss';

type ParagraphProps = {
  richText: RichTextDTO;
};

// TODO key に UUID を使うのは適切か検討
export function Paragraph({ richText }: ParagraphProps) {
  return (
    <p className={styles.paragraph}>
      {richText.map((text) => (
        <span key={createUUIDv4()}>
          <StyledText richText={text} />
        </span>
      ))}
    </p>
  );
}

export default memo(Paragraph);

function StyledText({ richText }: { richText: RichTextDTO[number] }) {
  let text = richText.text as React.ReactNode;
  if (richText.styles?.bold) {
    text = <strong>{text}</strong>;
  }
  if (richText.styles?.inlineCode) {
    text = <code className={styles.inlineCodeText}>{text}</code>;
  }
  return <span key={createUUIDv4()}>{text}</span>;
}

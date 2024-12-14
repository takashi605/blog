import React, { memo } from 'react';
import type { RichTextForDTO } from 'service/src/blogPostService/dto/contentDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';
import styles from './paragraph.module.scss';

type ParagraphProps = {
  richText: RichTextForDTO;
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

function StyledText({ richText }: { richText: RichTextForDTO[number] }) {
  let text = richText.text as React.ReactNode;
  if (richText.styles?.bold) {
    text = <strong>{text}</strong>;
  }
  return <span key={createUUIDv4()}>{text}</span>;
}

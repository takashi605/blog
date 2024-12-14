import { memo } from 'react';
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
        <span key={createUUIDv4()}>{text.text}</span>
      ))}
    </p>
  );
}

export default memo(Paragraph);

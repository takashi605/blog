'use client';
import type { components } from 'shared-lib/src/generated/api-types';
import styles from '../styles/blogPostViewer.module.scss';
import CldFillImage from '../../components/ui/CldFillImage';

type ImageBlock = components['schemas']['ImageBlock'];

type ImageContentProps = {
  imageContent: ImageBlock;
};

function ImageContent({ imageContent }: ImageContentProps) {
  return (
    <div className={styles.imageContent}>
      <CldFillImage path={imageContent.path} alt="画像コンテンツ" />
    </div>
  );
}

export default ImageContent;

'use client';
import { CldImage } from 'next-cloudinary';
import type { components } from 'shared-lib/src/generated/api-types';
import styles from './imageContent.module.scss';

type ImageBlock = components['schemas']['ImageBlock'];

type ImageContentProps = {
  imageContent: ImageBlock;
};

function ImageContent({ imageContent }: ImageContentProps) {
  return (
    <>
      <CldImage
        className={styles.image}
        src={imageContent.path}
        width={500}
        height={500}
        alt="画像コンテンツ"
      />
    </>
  );
}

export default ImageContent;

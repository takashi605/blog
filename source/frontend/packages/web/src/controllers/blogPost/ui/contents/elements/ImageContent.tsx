'use client';
import { CldImage } from 'next-cloudinary';
import type { ImageContentDTO } from 'service/src/blogPostService/dto/contentDTO';
import styles from './imageContent.module.scss';

type ImageContentProps = {
  imageContent: ImageContentDTO;
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

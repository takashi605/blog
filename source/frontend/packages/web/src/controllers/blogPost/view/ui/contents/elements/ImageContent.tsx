'use client';
import { CldImage } from 'next-cloudinary';
import type { ImageForDTO } from 'service/src/blogPostService/dto/contentDTO';

type ImageContentProps = {
  imageContent: ImageForDTO;
};

function ImageContent({ imageContent }: ImageContentProps) {
  return (
    <>
      <CldImage
        src={imageContent.path}
        width={500}
        height={500}
        alt="画像コンテンツ"
      />
    </>
  );
}

export default ImageContent;

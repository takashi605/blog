'use client';
import type { ImageForDTO } from '@/usecases/view/output/dto/contentForDTO';
import { CldImage } from 'next-cloudinary';

type ImageContentProps = {
  imageContent: ImageForDTO;
};

function ImageContent({ imageContent }: ImageContentProps) {
  return (
    <CldImage
      src={imageContent.path}
      width={500}
      height={500}
      alt="画像コンテンツ"
    />
  );
}

export default ImageContent;

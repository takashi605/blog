'use client';
import { CldImage } from 'next-cloudinary';
import type { components } from 'shared-lib/src/generated/api-types';

type ImageBlock = components['schemas']['ImageBlock'];

type ImageContentProps = {
  imageContent: ImageBlock;
};

function ImageContent({ imageContent }: ImageContentProps) {
  return (
    <>
      <CldImage
        src={imageContent.path}
        alt="画像コンテンツ"
        // Cloudinary に画質自動最適化を依頼
        quality="auto"
        // 端末ごとの物理ピクセル密度に応じて画像を最適化
        dpr="auto"
        // Next.js の fill モードを有効化
        fill
        sizes="100%"
        style={{ objectFit: 'contain' }}
      />
    </>
  );
}

export default ImageContent;
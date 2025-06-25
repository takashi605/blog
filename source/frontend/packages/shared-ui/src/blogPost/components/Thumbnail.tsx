'use client';
import { CldImage } from 'next-cloudinary';

type ThumbnailProps = {
  path: string;
};

function Thumbnail({ path }: ThumbnailProps) {
  return (
    <CldImage
      src={path}
      alt="サムネイル画像"
      // Cloudinary に画質自動最適化を依頼
      quality="auto"
      // 端末ごとの物理ピクセル密度に応じて画像を最適化
      dpr="auto"
      // Next.js の fill モードを有効化
      fill
      style={{ objectFit: 'cover' }}
      sizes="100%"
    />
  );
}

export default Thumbnail;

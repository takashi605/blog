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
      width={100}
      height={100}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
    />
  );
}

export default Thumbnail;

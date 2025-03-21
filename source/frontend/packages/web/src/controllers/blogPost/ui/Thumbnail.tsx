'use client';
import { CldImage } from 'next-cloudinary';
import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';

// TODO Thumbnail に thumbnail を渡すというのは文脈的におかしいので直す
type ThumbnailProps = {
  thumbnail: ImageDTO;
};

function Thumbnail({ thumbnail }: ThumbnailProps) {
  return (
    <CldImage
      src={thumbnail.path}
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

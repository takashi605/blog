'use client';
import type { thumbnailDTO } from '@/usecases/view/output/dto';
import { CldImage } from 'next-cloudinary';

type ThumbnailProps = {
  thumbnail: thumbnailDTO;
};

function Thumbnail({ thumbnail }: ThumbnailProps) {
  return (
    <div>
      {/* <CldImage
        src={thumbnail.path}
        alt="サムネイル画像"
        width={100}
        height={100}
        style={{ width: '100%', height: '500px', objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
      /> */}
      <img src={thumbnail.path} alt="サムネイル画像" />
    </div>
  );
}

export default Thumbnail;

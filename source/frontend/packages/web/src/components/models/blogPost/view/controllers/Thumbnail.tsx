import type { thumbnailDTO } from '@/usecases/view/output/dto';

type ThumbnailProps = {
  thumbnail: thumbnailDTO;
};

function Thumbnail({ thumbnail }: ThumbnailProps) {
  return (
    <div>
      <img src={thumbnail.path} alt="サムネイル画像" />
    </div>
  );
}

export default Thumbnail;

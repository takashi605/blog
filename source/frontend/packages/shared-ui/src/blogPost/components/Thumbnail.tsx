'use client';
import CldFillImage from '../../components/ui/CldFillImage';

type ThumbnailProps = {
  path: string;
};

function Thumbnail({ path }: ThumbnailProps) {
  return <CldFillImage path={path} alt="サムネイル画像" objectFit="cover" />;
}

export default Thumbnail;

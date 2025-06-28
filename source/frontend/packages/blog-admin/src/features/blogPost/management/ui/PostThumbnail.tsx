import { CldImage } from 'next-cloudinary';
import styles from './PostThumbnail.module.scss';

interface PostThumbnailProps {
  imagePath: string;
  alt?: string;
}

export default function PostThumbnail({
  imagePath,
  alt = 'サムネイル画像',
}: PostThumbnailProps) {
  return (
    <CldImage
      src={imagePath}
      width={120}
      height={80}
      alt={alt}
      className={styles.thumbnail}
    />
  );
}

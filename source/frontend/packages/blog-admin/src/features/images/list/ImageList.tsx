'use client';
import { CldImage } from 'next-cloudinary';
import styles from './ImageList.module.scss';
import { useImageList } from './useImageList';

function ImageList() {
  const { getAllImages } = useImageList();

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>画像一覧</h2>
      <ul className={styles.imageGrid}>
        {getAllImages().map((image) => (
          <li key={image.id} className={styles.imageCard}>
            <div className={styles.imageWrapper}>
              <CldImage
                src={image.path}
                width={300}
                height={200}
                alt="画像コンテンツ"
                className={styles.image}
              />
            </div>
            <div className={styles.imageInfo}>
              <p className={styles.imagePath}>{image.path}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ImageList;

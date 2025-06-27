'use client';
import { CldImage } from 'next-cloudinary';
import type { components } from 'shared-lib/src/generated/api-types';
import styles from '../styles/blogPostViewer.module.scss';

type ImageBlock = components['schemas']['ImageBlock'];

type ImageContentProps = {
  imageContent: ImageBlock;
};

function ImageContent({ imageContent }: ImageContentProps) {
  return (
    <div className={styles.imageContent}>
      <CldImage
        src={imageContent.path}
        alt="画像コンテンツ"
        // Cloudinary に画質自動最適化を依頼
        quality="auto"
        // 端末ごとの物理ピクセル密度に応じて画像を最適化
        dpr="auto"
        // Next.js の fill モードを有効化
        fill
        // ci テスト環境で fill モード Image を使った場合、画像要素が他の要素に覆いかぶさってしまう
        // この問題に対処するため、 pointer-events を none に設定
        // なお、ci 環境以外だと問題なく、再現も難しいため根本的な原因は不明
        style={{ objectFit: 'contain', pointerEvents: 'none' }}
        sizes="100%"
      />
    </div>
  );
}

export default ImageContent;

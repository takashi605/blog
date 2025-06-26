import { useFormContext } from 'react-hook-form';
import Thumbnail from 'shared-ui/src/blogPost/components/Thumbnail';
import styles from 'shared-ui/src/blogPost/styles/blogPostViewer.module.scss';

function ThumbnailPreview() {
  const form = useFormContext();
  const path = form.watch('thumbnail.path');
  return (
    <>
      {path && (
        // ci 環境でサムネイル画像がクリックイベントをインターセプトする問題を回避するために pointerEvents を none に設定
        // 手動操作では再現不可のため、根本的な解決は保留
        <div className={styles.thumbnail} style={{ pointerEvents: 'none' }}>
          <Thumbnail path={path} />
        </div>
      )}
    </>
  );
}

export default ThumbnailPreview;

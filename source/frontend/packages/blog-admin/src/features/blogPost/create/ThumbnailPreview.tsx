import { useFormContext } from 'react-hook-form';
import Thumbnail from 'shared-ui/src/blogPost/components/Thumbnail';
import sharedStyles from 'shared-ui/src/blogPost/styles/blogPostViewer.module.scss';
import styles from './thumbnailPreview.module.scss';

function ThumbnailPreview() {
  const form = useFormContext();
  const path = form.watch('thumbnail.path');
  return (
    <>
      {path && (
        <div className={`${sharedStyles.thumbnail} ${styles.thumbnailPreview}`}>
          <Thumbnail path={path} />
        </div>
      )}
    </>
  );
}

export default ThumbnailPreview;

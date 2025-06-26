import { useFormContext } from 'react-hook-form';
import Thumbnail from 'shared-ui/src/blogPost/components/Thumbnail';
import styles from 'shared-ui/src/blogPost/styles/blogPostViewer.module.scss';

function ThumbnailPreview() {
  const form = useFormContext();
  const path = form.watch('thumbnail.path');
  return (
    <>
      {path && (
        <div className={styles.thumbnail}>
          <Thumbnail path={path} />
        </div>
      )}
    </>
  );
}

export default ThumbnailPreview;

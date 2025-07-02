import CommonModalProvider from '../../components/modal/CommonModalProvider';
import PageHeader from '../../components/ui/PageHeader';
import ImageList from '../../features/images/list/ImageList';
import ImageListProvider from '../../features/images/list/ImageListProvider';
import ImageUploadModalWithOpenButton from '../../features/images/upload/ImageUploadModal';
import styles from './page.module.scss';

export default function ImageManagementPage() {
  return (
    <div>
      <CommonModalProvider>
        <PageHeader
          title="画像の管理"
          backButtonTo="/"
          backButtonText="ダッシュボードに戻る"
        />
        <ImageListProvider>
          <div className={styles.uploadButtonContainer}>
            <ImageUploadModalWithOpenButton />
          </div>
          <ImageList />
        </ImageListProvider>
      </CommonModalProvider>
    </div>
  );
}

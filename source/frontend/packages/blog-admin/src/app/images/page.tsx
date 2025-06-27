import BackButton from '../../components/ui/backButton';
import CommonModalProvider from '../../components/modal/CommonModalProvider';
import PageTitle from '../../components/ui/pageTitle';
import ImageList from '../../features/images/list/ImageList';
import ImageListProvider from '../../features/images/list/ImageListProvider';
import ImageUploadModalWithOpenButton from '../../features/images/upload/ImageUploadModal';

export default function ImageManagementPage() {
  return (
    <div>
      <CommonModalProvider>
        <BackButton to="/">ダッシュボードに戻る</BackButton>
        <PageTitle>画像の管理</PageTitle>
        <ImageListProvider>
          <ImageUploadModalWithOpenButton />
          <ImageList />
        </ImageListProvider>
      </CommonModalProvider>
    </div>
  );
}

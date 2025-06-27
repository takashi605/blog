import CommonModalProvider from '../../components/modal/CommonModalProvider';
import BackButton from '../../components/ui/backButton';
import HorizontalStack from '../../components/ui/HorizontalStack';
import PageTitle from '../../components/ui/pageTitle';
import ImageList from '../../features/images/list/ImageList';
import ImageListProvider from '../../features/images/list/ImageListProvider';
import ImageUploadModalWithOpenButton from '../../features/images/upload/ImageUploadModal';

export default function ImageManagementPage() {
  return (
    <div>
      <CommonModalProvider>
        <HorizontalStack>
          <PageTitle>画像の管理</PageTitle>
          <BackButton to="/">ダッシュボードに戻る</BackButton>
        </HorizontalStack>
        <ImageListProvider>
          <ImageUploadModalWithOpenButton />
          <ImageList />
        </ImageListProvider>
      </CommonModalProvider>
    </div>
  );
}

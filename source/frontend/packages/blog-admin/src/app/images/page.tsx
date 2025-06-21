import CommonModalProvider from '../../components/modal/CommonModalProvider';
import ImageList from '../../features/images/list/ImageList';
import ImageListProvider from '../../features/images/list/ImageListProvider';
import ImageUploadModalWithOpenButton from '../../features/images/upload/ImageUploadModal';

export default function ImageManagementPage() {
  return (
    <div>
      <CommonModalProvider>
        <h1>画像の管理</h1>
        <ImageListProvider>
          <ImageUploadModalWithOpenButton />
          <ImageList />
        </ImageListProvider>
      </CommonModalProvider>
    </div>
  );
}

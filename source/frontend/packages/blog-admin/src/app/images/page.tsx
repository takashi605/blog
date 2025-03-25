import CommonModalProvider from '../../components/modal/CommonModalProvider';
import ImageList from '../../controllers/images/list/ImageList';
import ImageListProvider from '../../controllers/images/list/ImageListProvider';
import ImageUploadModalWithOpenButton from '../../controllers/images/upload/ImageUploadModal';

export default function CreateBlogPostPage() {
  return (
    <div>
      <CommonModalProvider>
        <h2>画像の管理</h2>
        <ImageListProvider>
          <ImageUploadModalWithOpenButton />
          <ImageList />
        </ImageListProvider>
      </CommonModalProvider>
    </div>
  );
}

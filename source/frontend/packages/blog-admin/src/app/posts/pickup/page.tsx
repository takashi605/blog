import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PickUpPostList from '../../../controllers/blogPost/pickup/list/PickUpPostList';
import PickUpPostListProvider from '../../../controllers/blogPost/pickup/list/PickUpPostListProvider';
import PickUpPostSelectModalWithOpenButton from '../../../controllers/blogPost/pickup/select/PickUpPostSelectModal';

export default function PickUpManagementPage() {
  return (
    <div>
      <h1>ピックアップ記事管理</h1>
      <section>
        <PickUpPostListProvider>
          <PickUpPostList />
          <CommonModalProvider>
            <PickUpPostSelectModalWithOpenButton />
          </CommonModalProvider>
        </PickUpPostListProvider>
      </section>
    </div>
  );
}

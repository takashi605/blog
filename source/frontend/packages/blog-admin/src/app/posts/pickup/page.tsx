import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PickUpPostList from '../../../features/blogPost/pickup/list/PickUpPostList';
import PickUpPostListProvider from '../../../features/blogPost/pickup/list/PickUpPostListProvider';
import PickUpPostSelectModalWithOpenButton from '../../../features/blogPost/pickup/select/PickUpPostSelectModal';

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

import PickUpPostList from '../../../controllers/blogPost/pickup/PickUpPostList';
import PickUpPostListProvider from '../../../controllers/blogPost/pickup/PickUpPostListProvider';

export default function PickUpManagementPage() {
  return (
    <div>
      <h1>ピックアップ記事管理</h1>
      <section>
        <PickUpPostListProvider>
          <PickUpPostList />
        </PickUpPostListProvider>
      </section>
    </div>
  );
}

import PickUpPostList from '../../../controllers/blogPost/pickup/PickUpPostList';

export default function PickUpManagementPage() {
  return (
    <div>
      <h1>ピックアップ記事管理</h1>
      <section>
        <PickUpPostList />
      </section>
    </div>
  );
}

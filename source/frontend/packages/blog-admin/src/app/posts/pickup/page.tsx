'use client';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PageHeader from '../../../components/ui/PageHeader';
import PickUpPostList from '../../../features/blogPost/pickup/list/PickUpPostList';
import PickUpPostListProvider from '../../../features/blogPost/pickup/list/PickUpPostListProvider';
import PickUpPostSelectModalWithOpenButton from '../../../features/blogPost/pickup/select/PickUpPostSelectModal';

export default function PickUpManagementPage() {
  return (
    <div>
      <PageHeader
        title="ピックアップ記事管理"
        backButtonTo="/posts"
        backButtonText="記事管理画面に戻る"
      />
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

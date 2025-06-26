'use client';
import { useRouter } from 'next/navigation';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PageTitle from '../../../components/ui/pageTitle';
import PickUpPostList from '../../../features/blogPost/pickup/list/PickUpPostList';
import PickUpPostListProvider from '../../../features/blogPost/pickup/list/PickUpPostListProvider';
import PickUpPostSelectModalWithOpenButton from '../../../features/blogPost/pickup/select/PickUpPostSelectModal';

export default function PickUpManagementPage() {
  const router = useRouter();

  return (
    <div>
      <PageTitle>ピックアップ記事管理</PageTitle>
      <button type="button" onClick={() => router.push('/posts')}>
        記事管理画面に戻る
      </button>
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

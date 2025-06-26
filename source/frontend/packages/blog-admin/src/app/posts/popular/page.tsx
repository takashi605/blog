'use client';
import { useRouter } from 'next/navigation';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PageTitle from '../../../components/ui/pageTitle';
import PopularPostList from '../../../features/blogPost/popular/list/PopularPostList';
import PopularPostListProvider from '../../../features/blogPost/popular/list/PopularPostListProvider';
import PopularPostSelectModalWithOpenButton from '../../../features/blogPost/popular/select/PopularPostSelectModal';

export default function PopularManagementPage() {
  const router = useRouter();

  return (
    <div>
      <PageTitle>人気記事管理</PageTitle>
      <button type="button" onClick={() => router.push('/posts')}>
        記事管理画面に戻る
      </button>
      <section>
        <PopularPostListProvider>
          <PopularPostList />
          <CommonModalProvider>
            <PopularPostSelectModalWithOpenButton />
          </CommonModalProvider>
        </PopularPostListProvider>
      </section>
    </div>
  );
}

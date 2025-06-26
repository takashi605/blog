'use client';
import { useRouter } from 'next/navigation';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import TopTechPickPostSelectModalWithOpenButton from '../../../features/blogPost/topTechPick/select/TopTechPickSelectModal';
import TopTechPickPostList from '../../../features/blogPost/topTechPick/view/TopTechPickPostView';
import TopTechPickPostViewProvider from '../../../features/blogPost/topTechPick/view/TopTechPickViewProvider';

export default function TopTechPickManagementPage() {
  const router = useRouter();

  return (
    <div>
      <h1>トップテックピック記事管理</h1>
      <button type="button" onClick={() => router.push('/posts')}>
        記事管理画面に戻る
      </button>
      <section>
        <TopTechPickPostViewProvider>
          <TopTechPickPostList />
          <CommonModalProvider>
            <TopTechPickPostSelectModalWithOpenButton />
          </CommonModalProvider>
        </TopTechPickPostViewProvider>
      </section>
    </div>
  );
}

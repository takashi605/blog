'use client';
import { useRouter } from 'next/navigation';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PageTitle from '../../../components/ui/pageTitle';
import TopTechPickPostSelectModalWithOpenButton from '../../../features/blogPost/topTechPick/select/TopTechPickSelectModal';
import TopTechPickPostList from '../../../features/blogPost/topTechPick/view/TopTechPickPostView';
import TopTechPickPostViewProvider from '../../../features/blogPost/topTechPick/view/TopTechPickViewProvider';

export default function TopTechPickManagementPage() {
  const router = useRouter();

  return (
    <div>
      <PageTitle>トップテックピック記事管理</PageTitle>
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

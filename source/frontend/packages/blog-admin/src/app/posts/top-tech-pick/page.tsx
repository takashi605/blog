'use client';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import BackButton from '../../../components/ui/backButton';
import HorizontalStack from '../../../components/ui/HorizontalStack';
import PageTitle from '../../../components/ui/pageTitle';
import TopTechPickPostSelectModalWithOpenButton from '../../../features/blogPost/topTechPick/select/TopTechPickSelectModal';
import TopTechPickPostList from '../../../features/blogPost/topTechPick/view/TopTechPickPostView';
import TopTechPickPostViewProvider from '../../../features/blogPost/topTechPick/view/TopTechPickViewProvider';

export default function TopTechPickManagementPage() {
  return (
    <div>
      <HorizontalStack>
        <PageTitle>トップテックピック記事管理</PageTitle>
        <BackButton to="/posts">記事管理画面に戻る</BackButton>
      </HorizontalStack>
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

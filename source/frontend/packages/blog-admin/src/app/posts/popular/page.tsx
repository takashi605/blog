'use client';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import BackButton from '../../../components/ui/backButton';
import HorizontalStack from '../../../components/ui/HorizontalStack';
import PageTitle from '../../../components/ui/pageTitle';
import PopularPostList from '../../../features/blogPost/popular/list/PopularPostList';
import PopularPostListProvider from '../../../features/blogPost/popular/list/PopularPostListProvider';
import PopularPostSelectModalWithOpenButton from '../../../features/blogPost/popular/select/PopularPostSelectModal';

export default function PopularManagementPage() {
  return (
    <div>
      <HorizontalStack>
        <PageTitle>人気記事管理</PageTitle>
        <BackButton to="/posts">記事管理画面に戻る</BackButton>
      </HorizontalStack>
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

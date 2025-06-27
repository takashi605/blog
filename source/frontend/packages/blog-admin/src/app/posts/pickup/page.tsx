'use client';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import BackButton from '../../../components/ui/backButton';
import HorizontalStack from '../../../components/ui/HorizontalStack';
import PageTitle from '../../../components/ui/pageTitle';
import PickUpPostList from '../../../features/blogPost/pickup/list/PickUpPostList';
import PickUpPostListProvider from '../../../features/blogPost/pickup/list/PickUpPostListProvider';
import PickUpPostSelectModalWithOpenButton from '../../../features/blogPost/pickup/select/PickUpPostSelectModal';

export default function PickUpManagementPage() {
  return (
    <div>
      <HorizontalStack>
        <PageTitle>ピックアップ記事管理</PageTitle>
        <BackButton to="/posts">記事管理画面に戻る</BackButton>
      </HorizontalStack>
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

'use client';
import BackButton from '../../../components/ui/backButton';
import PageTitle from '../../../components/ui/pageTitle';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PickUpPostList from '../../../features/blogPost/pickup/list/PickUpPostList';
import PickUpPostListProvider from '../../../features/blogPost/pickup/list/PickUpPostListProvider';
import PickUpPostSelectModalWithOpenButton from '../../../features/blogPost/pickup/select/PickUpPostSelectModal';
import styles from './page.module.scss';

export default function PickUpManagementPage() {
  return (
    <div>
      <div className={styles.header}>
        <PageTitle>ピックアップ記事管理</PageTitle>
        <BackButton to="/posts">記事管理画面に戻る</BackButton>
      </div>
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

'use client';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import BackButton from '../../../components/ui/backButton';
import PageTitle from '../../../components/ui/pageTitle';
import PopularPostList from '../../../features/blogPost/popular/list/PopularPostList';
import PopularPostListProvider from '../../../features/blogPost/popular/list/PopularPostListProvider';
import PopularPostSelectModalWithOpenButton from '../../../features/blogPost/popular/select/PopularPostSelectModal';
import styles from './page.module.scss';

export default function PopularManagementPage() {
  return (
    <div>
      <div className={styles.header}>
        <PageTitle>人気記事管理</PageTitle>
        <BackButton to="/posts">記事管理画面に戻る</BackButton>
      </div>
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

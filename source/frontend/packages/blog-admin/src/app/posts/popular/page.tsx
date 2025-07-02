'use client';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PageHeader from '../../../components/ui/PageHeader';
import PopularPostList from '../../../features/blogPost/popular/list/PopularPostList';
import PopularPostListProvider from '../../../features/blogPost/popular/list/PopularPostListProvider';
import PopularPostSelectModalWithOpenButton from '../../../features/blogPost/popular/select/PopularPostSelectModal';
import styles from './page.module.scss';

export default function PopularManagementPage() {
  return (
    <div>
      <PageHeader
        title="人気記事管理"
        backButtonTo="/posts"
        backButtonText="記事管理画面に戻る"
      />
      <section>
        <PopularPostListProvider>
          <CommonModalProvider>
            <div className={styles.selectButton}>
              <PopularPostSelectModalWithOpenButton />
            </div>
          </CommonModalProvider>
          <PopularPostList />
        </PopularPostListProvider>
      </section>
    </div>
  );
}

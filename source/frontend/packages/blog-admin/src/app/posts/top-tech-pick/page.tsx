'use client';
import BackButton from '../../../components/ui/backButton';
import PageTitle from '../../../components/ui/pageTitle';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import TopTechPickPostSelectModalWithOpenButton from '../../../features/blogPost/topTechPick/select/TopTechPickSelectModal';
import TopTechPickPostList from '../../../features/blogPost/topTechPick/view/TopTechPickPostView';
import TopTechPickPostViewProvider from '../../../features/blogPost/topTechPick/view/TopTechPickViewProvider';
import styles from './page.module.scss';

export default function TopTechPickManagementPage() {
  return (
    <div>
      <div className={styles.header}>
        <PageTitle>トップテックピック記事管理</PageTitle>
        <BackButton to="/posts">記事管理画面に戻る</BackButton>
      </div>
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

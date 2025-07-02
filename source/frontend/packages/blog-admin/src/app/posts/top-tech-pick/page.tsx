'use client';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PageHeader from '../../../components/ui/PageHeader';
import TopTechPickPostSelectModalWithOpenButton from '../../../features/blogPost/topTechPick/select/TopTechPickSelectModal';
import TopTechPickPostList from '../../../features/blogPost/topTechPick/view/TopTechPickPostView';
import TopTechPickPostViewProvider from '../../../features/blogPost/topTechPick/view/TopTechPickViewProvider';
import styles from './page.module.scss';

export default function TopTechPickManagementPage() {
  return (
    <div>
      <PageHeader
        title="トップテックピック記事管理"
        backButtonTo="/posts"
        backButtonText="記事管理画面に戻る"
      />
      <section>
        <TopTechPickPostViewProvider>
          <CommonModalProvider>
            <div className={styles.selectButton}>
              <TopTechPickPostSelectModalWithOpenButton />
            </div>
          </CommonModalProvider>
          <TopTechPickPostList />
        </TopTechPickPostViewProvider>
      </section>
    </div>
  );
}

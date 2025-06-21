import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import TopTechPickPostSelectModalWithOpenButton from '../../../features/blogPost/topTechPick/select/TopTechPickSelectModal';
import TopTechPickPostList from '../../../features/blogPost/topTechPick/view/TopTechPickPostView';
import TopTechPickPostViewProvider from '../../../features/blogPost/topTechPick/view/TopTechPickViewProvider';

export default function TopTechPickManagementPage() {
  return (
    <div>
      <h1>トップテックピック記事管理</h1>
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

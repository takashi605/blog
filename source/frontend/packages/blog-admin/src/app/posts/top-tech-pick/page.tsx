// import CommonModalProvider from '../../../components/modal/CommonModalProvider';
// import TopTechPickPostSelectModalWithOpenButton from '../../../controllers/blogPost/topTechPick/select/TopTechPickPostSelectModal';
import TopTechPickPostList from '../../../controllers/blogPost/topTechPick/view/TopTechPickPostView';
import TopTechPickPostViewProvider from '../../../controllers/blogPost/topTechPick/view/TopTechPickViewProvider';

export default function TopTechPickManagementPage() {
  return (
    <div>
      <h1>トップテックピック記事管理</h1>
      <section>
        <TopTechPickPostViewProvider>
          <TopTechPickPostList />
          {/* <CommonModalProvider>
            <TopTechPickPostSelectModalWithOpenButton />
          </CommonModalProvider> */}
        </TopTechPickPostViewProvider>
      </section>
    </div>
  );
}

// import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import PopularPostList from '../../../controllers/blogPost/popular/list/PopularPostList';
import PopularPostListProvider from '../../../controllers/blogPost/popular/list/PopularPostListProvider';
// import PopularPostSelectModalWithOpenButton from '../../../controllers/blogPost/popular/select/PopularPostSelectModal';

export default function PopularManagementPage() {
  return (
    <div>
      <h1>人気記事管理</h1>
      <section>
        <PopularPostListProvider>
          <PopularPostList />
          {/* <CommonModalProvider>
            <PopularPostSelectModalWithOpenButton />
          </CommonModalProvider> */}
        </PopularPostListProvider>
      </section>
    </div>
  );
}

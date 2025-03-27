import CreateBlogPostForm from '@/controllers/blogPost/create/CreateBlogPostForm';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';

export default function CreateBlogPostPage() {
  return (
    <div>
      <h2>記事投稿ページ</h2>
      <CommonModalProvider>
        <CreateBlogPostForm />
      </CommonModalProvider>
    </div>
  );
}

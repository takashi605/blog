import PageTitle from '@/components/ui/pageTitle';
import CreateBlogPostForm from '@/features/blogPost/create/CreateBlogPostForm';

export default function CreateBlogPostPage() {
  return (
    <div>
      <PageTitle>記事投稿ページ</PageTitle>
      <CreateBlogPostForm />
    </div>
  );
}

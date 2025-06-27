import PageHeader from '@/components/ui/PageHeader';
import CreateBlogPostForm from '@/features/blogPost/create/CreateBlogPostForm';

export default function CreateBlogPostPage() {
  return (
    <div>
      <PageHeader
        title="記事投稿ページ"
        backButtonTo="/posts"
        backButtonText="記事管理画面に戻る"
      />
      <CreateBlogPostForm />
    </div>
  );
}

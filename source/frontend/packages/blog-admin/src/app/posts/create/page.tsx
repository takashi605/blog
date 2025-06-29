import PageHeader from '@/components/ui/PageHeader';
import CreateBlogPostForm from '@/features/blogPost/create/CreateBlogPostForm';
import { BlogPostFormProvider } from '@/features/blogPost/create/form/BlogPostFormProvider';

export default function CreateBlogPostPage() {
  return (
    <div>
      <PageHeader
        title="記事投稿ページ"
        backButtonTo="/posts"
        backButtonText="記事管理画面に戻る"
      />
      <BlogPostFormProvider>
        <CreateBlogPostForm />
      </BlogPostFormProvider>
    </div>
  );
}

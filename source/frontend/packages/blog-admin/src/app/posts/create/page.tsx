import PageHeader from '@/components/ui/PageHeader';
import CreateBlogPostForm from '@/features/blogPost/create/CreateBlogPostForm';
import { BlogPostContentsProvider } from '@/features/blogPost/editor/blogPostEditor/BlogPostContentsProvider';
import { BlogPostFormProvider } from '@/features/blogPost/editor/form/BlogPostFormProvider';

export default function CreateBlogPostPage() {
  return (
    <div>
      <PageHeader
        title="記事投稿ページ"
        backButtonTo="/posts"
        backButtonText="記事管理画面に戻る"
      />
      <BlogPostFormProvider>
        <BlogPostContentsProvider>
          <CreateBlogPostForm />
        </BlogPostContentsProvider>
      </BlogPostFormProvider>
    </div>
  );
}

'use client';
import PageHeader from '@/components/ui/PageHeader';
import { useAdminBlogPost } from '@/features/blogPost/api/useAdminBlogPost';
import EditBlogPostForm from '@/features/blogPost/edit/EditBlogPostForm';
import { BlogPostContentsProvider } from '@/features/blogPost/editor/blogPostEditor/BlogPostContentsProvider';
import { BlogPostFormProvider } from '@/features/blogPost/editor/form/BlogPostFormProvider';
import { useParams } from 'next/navigation';

export default function EditBlogPostPage() {
  const params = useParams();
  const postId = params.id as string;

  const { blogPost, loading, error } = useAdminBlogPost(postId);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="記事編集ページ"
          backButtonTo="/posts"
          backButtonText="記事管理画面に戻る"
        />
        <p>記事を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="記事編集ページ"
          backButtonTo="/posts"
          backButtonText="記事管理画面に戻る"
        />
        <p role="alert">エラー: {error}</p>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div>
        <PageHeader
          title="記事編集ページ"
          backButtonTo="/posts"
          backButtonText="記事管理画面に戻る"
        />
        <p>記事が見つかりませんでした。</p>
      </div>
    );
  }

  // フォームの初期値を設定
  const formDefaultValues = {
    title: blogPost.title,
    thumbnail: {
      id: blogPost.thumbnail.id,
      path: blogPost.thumbnail.path,
    },
    publishedDate: blogPost.publishedDate,
  };

  return (
    <div>
      <PageHeader
        title="記事編集ページ"
        backButtonTo="/posts"
        backButtonText="記事管理画面に戻る"
      />

      <BlogPostFormProvider defaultValues={formDefaultValues}>
        <BlogPostContentsProvider>
          <EditBlogPostForm initialData={blogPost} />
        </BlogPostContentsProvider>
      </BlogPostFormProvider>
    </div>
  );
}

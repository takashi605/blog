'use client';
import ErrorMessage from '@/components/form/parts/ErrorMessage';
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

  // 共通のPageHeaderを一度だけ定義
  const pageHeader = (
    <PageHeader
      title="記事編集ページ"
      backButtonTo="/posts"
      backButtonText="記事管理画面に戻る"
    />
  );

  // 条件に応じた内容を決定
  let content;

  if (loading) {
    content = <p>記事を読み込み中...</p>;
  } else if (error) {
    content = <ErrorMessage>エラー: {error}</ErrorMessage>;
  } else if (!blogPost) {
    content = <p>記事が見つかりませんでした。</p>;
  } else {
    // フォームの初期値を設定
    const formDefaultValues = {
      title: blogPost.title,
      thumbnail: {
        id: blogPost.thumbnail.id,
        path: blogPost.thumbnail.path,
      },
      publishedDate: blogPost.publishedDate,
    };

    content = (
      <BlogPostFormProvider defaultValues={formDefaultValues}>
        <BlogPostContentsProvider>
          <EditBlogPostForm initialData={blogPost} />
        </BlogPostContentsProvider>
      </BlogPostFormProvider>
    );
  }

  return (
    <div>
      {pageHeader}
      {content}
    </div>
  );
}

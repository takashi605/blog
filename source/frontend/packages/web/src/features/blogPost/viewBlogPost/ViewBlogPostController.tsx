'use client';

import { useViewBlogPost } from '../api/useViewBlogPost';
import ViewBlogPostPresenter from './ViewBlogPostPresenter';

type ViewBlogPostControllerProps = {
  postId: string;
};

function ViewBlogPostController({ postId }: ViewBlogPostControllerProps) {
  const { blogPost, loading, error } = useViewBlogPost(postId);

  if (loading) {
    return <div>記事を読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  if (!blogPost) {
    return <div>記事が見つかりませんでした</div>;
  }

  return <ViewBlogPostPresenter blogPost={blogPost} />;
}

export default ViewBlogPostController;

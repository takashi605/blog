'use client';

import { useViewLatestBlogPosts } from '../api/useViewLatestBlogPosts';
import ViewLatestBlogPostsPresenter from './ViewLatestBlogPostsPresenter';

type ViewLatestBlogPostsControllerProps = {
  quantity?: number;
};

function ViewLatestBlogPostsController({
  quantity,
}: ViewLatestBlogPostsControllerProps) {
  const { blogPosts, loading, error } = useViewLatestBlogPosts({
    quantity,
  });

  if (error) {
    throw new Error(error);
  }

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return <ViewLatestBlogPostsPresenter blogPosts={blogPosts} />;
}

export default ViewLatestBlogPostsController;

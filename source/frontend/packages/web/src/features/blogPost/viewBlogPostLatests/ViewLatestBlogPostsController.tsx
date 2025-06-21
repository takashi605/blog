import { api } from 'shared-lib/src/api';
import ViewLatestBlogPostsPresenter from './ViewLatestBlogPostsPresenter';

type ViewLatestBlogPostsControllerProps = {
  quantity?: number;
};

async function ViewLatestBlogPostsController({
  quantity,
}: ViewLatestBlogPostsControllerProps) {
  try {
    // サーバーサイドで直接APIを呼び出し
    const allBlogPosts = await api.get('/api/v2/blog/posts/latest');

    // quantityが指定されている場合は、その数だけ制限
    const blogPosts =
      quantity !== undefined ? allBlogPosts.slice(0, quantity) : allBlogPosts;

    return <ViewLatestBlogPostsPresenter blogPosts={blogPosts} />;
  } catch (error) {
    console.error('最新記事の取得に失敗しました:', error);
    return <div>最新記事の読み込みに失敗しました</div>;
  }
}

export default ViewLatestBlogPostsController;

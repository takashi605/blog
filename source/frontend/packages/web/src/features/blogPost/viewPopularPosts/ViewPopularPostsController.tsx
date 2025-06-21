import { api } from 'shared-lib/src/api';
import ViewPopularPostsPresenter from './ViewPopularPostsPresenter';

async function ViewPopularPostsController() {
  try {
    // サーバーサイドで直接APIを呼び出し
    const allBlogPosts = await api.get('/api/v2/blog/posts/popular');
    // 3件に制限
    const blogPosts = allBlogPosts.slice(0, 3);

    return <ViewPopularPostsPresenter blogPosts={blogPosts} />;
  } catch (error) {
    console.error('人気記事の取得に失敗しました:', error);
    return <div>人気記事の読み込みに失敗しました</div>;
  }
}

export default ViewPopularPostsController;

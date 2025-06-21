import { api } from 'shared-lib/src/api';
import ViewPickUpPostsPresenter from './ViewPickUpPostsPresenter';

async function ViewPickUpPostsController() {
  try {
    // サーバーサイドで直接APIを呼び出し
    const allBlogPosts = await api.get('/api/v2/blog/posts/pickup');
    // 3件に制限
    const blogPostsDTO = allBlogPosts.slice(0, 3);

    return <ViewPickUpPostsPresenter blogPostsDTO={blogPostsDTO} />;
  } catch (error) {
    console.error('ピックアップ記事の取得に失敗しました:', error);
    return <div>ピックアップ記事の読み込みに失敗しました</div>;
  }
}

export default ViewPickUpPostsController;

import { api } from 'shared-lib/src/api';
import ViewTopTechPickPresenter from './ViewTopTechPickPresenter';

async function ViewTopTechPickController() {
  try {
    // サーバーサイドで直接APIを呼び出し
    const blogPost = await api.get('/api/v2/blog/posts/top-tech-pick');

    return <ViewTopTechPickPresenter blogPost={blogPost} />;
  } catch (error) {
    console.error('トップテック記事の取得に失敗しました:', error);
    return <div>トップテック記事の読み込みに失敗しました</div>;
  }
}

export default ViewTopTechPickController;

import { api, HttpError } from 'shared-lib/src/api';
import ViewBlogPostPresenter from './ViewBlogPostPresenter';

type ViewBlogPostControllerProps = {
  postId: string;
};

async function ViewBlogPostController({ postId }: ViewBlogPostControllerProps) {
  try {
    // サーバーサイドで直接APIを呼び出し
    const blogPost = await api.get('/api/v2/blog/posts/{uuid}', {
      pathParams: { uuid: postId },
    });

    return <ViewBlogPostPresenter blogPost={blogPost} />;
  } catch (error) {
    console.error('記事の取得に失敗しました:', error);

    if (error instanceof HttpError && error.status === 404) {
      return <div>記事が見つかりませんでした</div>;
    }

    return <div>記事の読み込みに失敗しました</div>;
  }
}

export default ViewBlogPostController;

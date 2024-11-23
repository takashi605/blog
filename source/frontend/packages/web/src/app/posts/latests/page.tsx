import ViewLatestBlogPostsController from '../../../controllers/blogPost/view/ViewLatestBlogPostsController';

// ビルド時ではなく、リクエスト時にレンダリングを行う
// こうしないと MSW によるモックサーバーが機能しない
// TODO: MSW の使用をやめたら、ビルド時にレンダリングするように変更する
export const dynamic = 'force-dynamic';

async function ViewBlogPost() {
  return (
    <div>
      <ViewLatestBlogPostsController />
    </div>
  );
}

export default ViewBlogPost;

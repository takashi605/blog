import ViewLatestBlogPostsController from '../../../controllers/blogPost/viewBlogPostLatests/ViewLatestBlogPostsController';

// ビルド時ではなく、リクエスト時にレンダリングを行う
// こうしないと MSW によるモックサーバーが機能しない
// TODO: MSW の使用をやめたら、ビルド時にレンダリングするように変更する
export const dynamic = 'force-dynamic';
export const revalidate = 2;

async function ViewBlogPost() {
  return (
    <section>
      <ViewLatestBlogPostsController />
    </section>
  );
}

export default ViewBlogPost;

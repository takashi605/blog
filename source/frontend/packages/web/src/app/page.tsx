import ViewPickUpPostsController from '../controllers/blogPost/viewPickUpPosts/ViewPickUpPostsController';
import ViewTopTechPickController from '../controllers/blogPost/viewTopTechPick/ViewTopTechPickController';

// ビルド時ではなく、リクエスト時にレンダリングを行う
// こうしないと MSW によるモックサーバーが機能しない
// TODO: MSW の使用をやめたら、ビルド時にレンダリングするように変更する
export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <>
      <section>
        <ViewTopTechPickController />
      </section>
      <section>
        <ViewPickUpPostsController />
      </section>
    </>
  );
}

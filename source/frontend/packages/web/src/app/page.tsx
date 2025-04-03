import ViewLatestBlogPostsController from '../controllers/blogPost/viewBlogPostLatests/ViewLatestBlogPostsController';
import ViewPickUpPostsController from '../controllers/blogPost/viewPickUpPosts/ViewPickUpPostsController';
import ViewPopularPostsController from '../controllers/blogPost/viewPopularPosts/ViewPopularPostsController';
import ViewTopTechPickController from '../controllers/blogPost/viewTopTechPick/ViewTopTechPickController';
import styles from './page.module.scss';

// ビルド時ではなく、リクエスト時にレンダリングを行う
// こうしないと MSW によるモックサーバーが機能しない
// TODO: MSW の使用をやめたら、ビルド時にレンダリングするように変更する
export const dynamic = 'force-dynamic';
export const revalidate = 2;

export default async function Home() {
  return (
    <>
      <section className={styles.viewTopTechPickSection}>
        <ViewTopTechPickController />
      </section>
      <section className={styles.viewLatestsSection}>
        <ViewLatestBlogPostsController quantity={3} />
      </section>
      <section className={styles.viewPickUpPostsSection}>
        <ViewPickUpPostsController />
      </section>
      <section className={styles.viewPopularPostsSection}>
        <ViewPopularPostsController />
      </section>
    </>
  );
}

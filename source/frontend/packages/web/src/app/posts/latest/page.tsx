import ViewLatestBlogPostsController from '../../../features/blogPost/viewBlogPostLatests/ViewLatestBlogPostsController';
import styles from './page.module.scss';

// ビルド時ではなく、リクエスト時にレンダリングを行う
// こうしないと MSW によるモックサーバーが機能しない
// TODO: MSW の使用をやめたら、ビルド時にレンダリングするように変更する
export const dynamic = 'force-dynamic';
export const revalidate = 2;

async function ViewBlogPost() {
  return (
    <section className={styles.viewLatestsSection}>
      <ViewLatestBlogPostsController />
    </section>
  );
}

export default ViewBlogPost;

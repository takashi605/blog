import CreateBlogPostForm from '@/features/blogPost/create/CreateBlogPostForm';
import styles from './page.module.scss';

export default function CreateBlogPostPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>記事投稿ページ</h1>
      <CreateBlogPostForm />
    </div>
  );
}

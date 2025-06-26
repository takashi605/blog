import BackButton from '@/components/ui/backButton';
import PageTitle from '@/components/ui/pageTitle';
import CreateBlogPostForm from '@/features/blogPost/create/CreateBlogPostForm';
import styles from './page.module.scss';

export default function CreateBlogPostPage() {
  return (
    <div>
      <div className={styles.header}>
        <PageTitle>記事投稿ページ</PageTitle>
        <BackButton to="/posts">記事管理画面に戻る</BackButton>
      </div>
      <CreateBlogPostForm />
    </div>
  );
}

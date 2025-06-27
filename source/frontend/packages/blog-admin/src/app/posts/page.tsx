import PageHeader from '../../components/ui/PageHeader';
import PostsManagement from '../../features/blogPost/management/PostsManagement';

export default function PostsManagementPage() {
  return (
    <div>
      <PageHeader
        title="記事管理"
        backButtonTo="/"
        backButtonText="ダッシュボードに戻る"
      />
      <PostsManagement />
    </div>
  );
}

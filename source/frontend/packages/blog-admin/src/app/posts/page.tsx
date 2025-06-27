import BackButton from '../../components/ui/backButton';
import PageTitle from '../../components/ui/pageTitle';
import PostsManagement from '../../features/blogPost/management/PostsManagement';

export default function PostsManagementPage() {
  return (
    <div>
      <BackButton to="/">ダッシュボードに戻る</BackButton>
      <PageTitle>記事管理</PageTitle>
      <PostsManagement />
    </div>
  );
}

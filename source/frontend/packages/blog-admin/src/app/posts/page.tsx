import BackButton from '../../components/ui/backButton';
import HorizontalStack from '../../components/ui/HorizontalStack';
import PageTitle from '../../components/ui/pageTitle';
import PostsManagement from '../../features/blogPost/management/PostsManagement';

export default function PostsManagementPage() {
  return (
    <div>
      <HorizontalStack>
        <PageTitle>記事管理</PageTitle>
        <BackButton to="/">ダッシュボードに戻る</BackButton>
      </HorizontalStack>
      <PostsManagement />
    </div>
  );
}

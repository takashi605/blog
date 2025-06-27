import PageTitle from '../../components/ui/pageTitle';
import PostsManagement from '../../features/blogPost/management/PostsManagement';

export default function PostsManagementPage() {
  return (
    <div>
      <PageTitle>記事管理</PageTitle>
      <PostsManagement />
    </div>
  );
}

import BackButton from '@/components/ui/backButton';
import HorizontalStack from '@/components/ui/HorizontalStack';
import PageTitle from '@/components/ui/pageTitle';
import CreateBlogPostForm from '@/features/blogPost/create/CreateBlogPostForm';

export default function CreateBlogPostPage() {
  return (
    <div>
      <HorizontalStack>
        <PageTitle>記事投稿ページ</PageTitle>
        <BackButton to="/posts">記事管理画面に戻る</BackButton>
      </HorizontalStack>
      <CreateBlogPostForm />
    </div>
  );
}

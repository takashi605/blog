import PageHeader from '@/components/ui/PageHeader';

export default function EditBlogPostPage() {
  return (
    <div>
      <PageHeader
        title="記事編集ページ"
        backButtonTo="/posts"
        backButtonText="記事管理画面に戻る"
      />
    </div>
  );
}

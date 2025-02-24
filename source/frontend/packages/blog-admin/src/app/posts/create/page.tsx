import CreateBlogPostForm from '@/controllers/blogPost/create/CreateBlogPostForm';

export default function CreateBlogPostPage() {
  console.log("CreateBlogPostPage コンポーネントを表示！");
  return (
    <div>
      <h2>記事投稿ページ</h2>
      <CreateBlogPostForm />
    </div>
  );
}

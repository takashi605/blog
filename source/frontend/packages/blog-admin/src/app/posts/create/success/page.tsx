import Link from 'next/link';

function CreateBlogPostSuccessPage() {
  return (
    <div>
      <p>記事を公開しました</p>
      <Link href="https://example.com">投稿した記事を見る</Link>
    </div>
  );
}

export default CreateBlogPostSuccessPage;

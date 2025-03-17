import Link from 'next/link';

function CreateBlogPostSuccessPage() {
  if (!process.env.NEXT_PUBLIC_WEB_URL) {
    throw new Error('WEB_URL が設定されていません');
  }
  const web_url = process.env.NEXT_PUBLIC_WEB_URL;
  return (
    <div>
      <p>記事を公開しました</p>
      <Link href={`${web_url}`}>投稿した記事を見る</Link>
    </div>
  );
}

export default CreateBlogPostSuccessPage;

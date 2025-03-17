import Link from 'next/link';

function CreateBlogPostSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (!process.env.NEXT_PUBLIC_WEB_URL) {
    throw new Error('WEB_URL が設定されていません');
  }
  const web_url = process.env.NEXT_PUBLIC_WEB_URL;

  const postedPageId = searchParams.id;
  if (!postedPageId) {
    throw new Error('id が設定されていません');
  }

  const postedPageUrl = `${web_url}/posts/${postedPageId}`;

  return (
    <div>
      <p>記事を公開しました</p>
      <Link href={postedPageUrl}>投稿した記事を見る</Link>
    </div>
  );
}

export default CreateBlogPostSuccessPage;

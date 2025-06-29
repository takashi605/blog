import Link from 'next/link';

function EditBlogPostSuccessPage({ params }: { params: { id: string } }) {
  if (!process.env.NEXT_PUBLIC_WEB_URL) {
    throw new Error('WEB_URL が設定されていません');
  }
  const web_url = process.env.NEXT_PUBLIC_WEB_URL;

  const editedPageId = params.id;
  if (!editedPageId) {
    throw new Error('id が設定されていません');
  }

  const editedPageUrl = `${web_url}/posts/${editedPageId}`;

  return (
    <div>
      <p>記事を編集しました</p>
      <Link href={editedPageUrl}>編集した記事を見る</Link>
    </div>
  );
}

export default EditBlogPostSuccessPage;

import Link from 'next/link';
import PageTitle from '../components/ui/pageTitle';

export default function Dashboard() {
  return (
    <div>
      <PageTitle>管理者ダッシュボード</PageTitle>
      <div className="flex flex-col gap-4">
        <div className="rounded-md border p-6">
          <h2 className="text-xl font-semibold mb-4">コンテンツ管理</h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/posts"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              記事管理
            </Link>
            <Link
              href="/images"
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              画像管理
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '新着記事一覧 | 鉄火ブログ',
  description: '新着記事一覧です。',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

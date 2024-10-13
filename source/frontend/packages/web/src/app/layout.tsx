import Header from '@/components/topLayout/header/Header';
import 'destyle.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from './layout.module.scss';

// フォントの定義
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ブログ',
  description: 'ブログサイト',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}

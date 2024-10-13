import Header from '@/components/topLayout/header/Header';
import 'destyle.css';
import styles from './layout.module.scss';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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

import Header from '@/components/topLayout/header/Header';
import 'destyle.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
import styles from './layout.module.scss';

// フォントの定義
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '鉄火ブログ',
  description: '個人的に学習・経験したことを垂れ流す技術ブログです。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d) {
                var config = {
                  kitId: 'pxq2mmy',
                  scriptTimeout: 3000,
                  async: true
                },
                h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
              })(document);
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${styles.body}`}>
        <Header />
        <main className={styles.main}>{children}</main>
        <footer>
          <div className={styles.footer}>
            <small>© 2025 TeccaBlog. All rights reserved.</small>
          </div>
        </footer>
      </body>
    </html>
  );
}

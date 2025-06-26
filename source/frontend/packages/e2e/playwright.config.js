import { defineConfig } from '@playwright/test';

export default defineConfig({
  outputDir: 'tests/test-results',
  timeout: 90 * 1000,
  expect: {
    // CI環境では期待値のタイムアウトを延長
    timeout: process.env.CI ? 30 * 1000 : 15 * 1000,
  },
  workers: process.env.CI ? 1 : 3,
  reporter: process.env.CI
    ? 'list'
    : [
        [
          'html',
          {
            outputFolder: 'tests/report',

            // ホスト上でレポートを開くためにホストとポートを指定
            // package.json の scripts 内のコマンドにも host と port を入れてあるので、ここを修正したら package.json も修正すること
            // 環境変数を使うようにするといいかも
            host: '0.0.0.0',
            port: '9323',
          },
        ],
      ],
  // リトライ設定
  retries: 2,
  use: {
    // CI環境での追加設定
    ...(process.env.CI
      ? {
          // アクションのタイムアウトを延長
          actionTimeout: 30 * 1000,

          // ナビゲーションのタイムアウトを延長
          navigationTimeout: 30 * 1000,

          // ビューポートサイズを固定
          viewport: { width: 1280, height: 900 },

          // ヘッドレスモードを明示的に指定
          headless: true,

          // コンテキストオプション
          contextOptions: {
            // アニメーションを無効化（パフォーマンス向上）
            reducedMotion: 'reduce',

            // タイムゾーンを固定
            timezoneId: 'Asia/Tokyo',

            // ロケールを固定
            locale: 'ja-JP',
          },
        }
      : {
          // ローカル環境での設定
          screenshot: 'off',
          video: 'off',
          trace: 'off',
        }),
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...defineConfig.use,
        browserName: 'chromium',

        // CI環境での追加のブラウザ設定
        ...(process.env.CI
          ? {
              // ブラウザの起動オプション
              launchOptions: {
                // GPUを無効化（CI環境でのパフォーマンス向上）
                args: [
                  '--disable-gpu',
                  '--disable-dev-shm-usage',
                  '--disable-setuid-sandbox',
                  '--no-sandbox',
                  // メモリ使用量を削減
                  '--disable-web-security',
                  '--disable-features=IsolateOrigins',
                  '--disable-site-isolation-trials',
                ],
              },
            }
          : {}),
      },
    },
  ],

  // 並列実行の設定
  fullyParallel: !process.env.CI, // CI環境では並列実行を無効化
});

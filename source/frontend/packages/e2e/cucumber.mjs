export default {
  loader: ['ts-node/esm'],
  paths: ['tests/**/*.feature'],
  import: ['support/**/*.ts', 'tests/**/*.spec.ts'],

  ...(process.env.CI
    ? {
        // パラレル実行を無効化
        parallel: 0,

        // タイムアウトを延長
        timeout: 60000, // 60秒

        // リトライ設定
        retry: 2,

        // より詳細なログ
        format: [
          'progress-bar',
          'json:tests/test-results/cucumber-report.json',
          'html:tests/test-results/cucumber-report.html',
        ],

        // エラー時の詳細情報
        formatOptions: {
          snippetInterface: 'async-await',
          colorsEnabled: false,
        },
      }
    : {}),
};

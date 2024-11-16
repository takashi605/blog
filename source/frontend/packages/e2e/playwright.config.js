import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  loader: ['ts-node/esm'],
  paths: ['tests/**/*.feature'],
  import: ['tests/**/*.spec.ts'],
});

export default defineConfig({
  testDir,
  outputDir: 'tests/test-results',
  timeout: 60 * 1000,
  expect: {
    timeout: 15 * 1000,
  },
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
});

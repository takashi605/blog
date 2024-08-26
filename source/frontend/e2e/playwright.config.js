import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  loader: ['ts-node/esm'],
  paths: ['tests/*.feature'],
  import: ['tests/*.spec.ts'],
});

export default defineConfig({
  testDir,
  outputDir: 'tests/test-results',
  reporter: [
    [
      'html',
      {
        open: process.env.CI ? 'never': 'always',
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

import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // テスト環境でnext.config.jsと.envファイルを読み込むために、Next.jsアプリへのパスを指定
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-fixed-jsdom',
  setupFiles: ['../../jest.setup.ts'],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
};

export default createJestConfig(config);

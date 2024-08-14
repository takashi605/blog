import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // テスト環境でnext.config.jsと.envファイルを読み込むために、Next.jsアプリへのパスを指定
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
};

export default createJestConfig(config);

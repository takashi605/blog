/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  coverageProvider: 'v8',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // ESMとして扱う拡張子を指定
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }], // トランスフォーム設定
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(shared-test-data)/)', // 必要なモジュールをトランスフォーム対象に含める
  ],
};

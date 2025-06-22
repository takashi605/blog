import { existsSync } from 'fs';
import { defineConfig } from 'openapi-typescript';

// OpenAPI仕様書のソース（ローカルファイル優先、なければAPI）
const openapiSource = existsSync('./openapi.json')
  ? './openapi.json'
  : 'http://localhost:8001/openapi.json';

export default defineConfig({
  // OpenAPI仕様書のソース
  input: openapiSource,
  // 型生成先ディレクトリ
  output: './packages/shared-lib/src/generated/api-types.ts',
});

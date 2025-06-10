import { defineConfig } from "openapi-typescript";
import { existsSync } from "fs";

// OpenAPI仕様書のソース（ローカルファイル優先、なければAPI）
const openapiSource = existsSync("./openapi.json") 
  ? "./openapi.json" 
  : "http://localhost:8000/openapi.json";

export default defineConfig({
  // OpenAPI仕様書のソース
  input: openapiSource,
  // 型生成先ディレクトリ
  output: "./packages/shared-interface-adapter/src/generated/api-types.ts",
});
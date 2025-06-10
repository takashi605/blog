import { defineConfig } from "openapi-typescript";

export default defineConfig({
  // OpenAPI仕様書のURL（ローカル開発環境）
  openapi: "http://localhost:8080/openapi.json",
  // 型生成先ディレクトリ
  output: "./packages/shared-interface-adapter/src/generated/api-types.ts",
  // 生成オプション
  options: {
    // オブジェクトキーにアクセスしやすくする
    pathParamsAsTypes: false,
    // 型名を読みやすくする
    transform: {
      // 型名変換（必要に応じて）
    },
    // 追加ヘッダー
    additionalProperties: true,
    // デフォルト値を含める
    defaultNonNullable: true,
  },
});
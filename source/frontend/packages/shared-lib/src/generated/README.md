# Generated API Types

このディレクトリには、OpenAPI仕様書から自動生成されたTypeScript型定義が含まれています。

## 生成方法

```bash
# フロントエンドルートディレクトリから実行
cd source/frontend
pnpm generate-types
```

## 注意事項

- **手動編集禁止**: このディレクトリ内のファイルは自動生成されるため、手動で編集しないでください
- **Git管理**: 生成されたファイルはGit管理対象です。バックエンドAPI変更時は`make generate-types`実行後にコミットしてください
- **型の使用**: バックエンドAPIとの型安全な通信のために、これらの型を使用してください

## 生成元

- **OpenAPI仕様書**: `http://localhost:8000/openapi.json`（開発環境APIサーバーから取得）
- **実行コマンド**: `make generate-types`（プロジェクトルートから実行）

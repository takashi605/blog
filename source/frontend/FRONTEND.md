# フロントエンド開発ガイド

このファイルはフロントエンド開発に関する情報を集約しています。

## フロントエンド構造

**PNPM ワークスペース構成のパッケージ:**

- **`web/`** - 公開ブログインターフェース（Next.js）
- **`blog-admin/`** - コンテンツ管理用管理画面（Next.js）
- **`e2e/`** - Playwright E2E テスト
- **`shared-lib/`** - 共有ライブラリ（API クライアント、型定義、MSW モック）
- **`shared-ui/`** - 共有 UI コンポーネント
- **`shared-test-data/`** - テストユーティリティ

## フロントエンド開発コマンド

```bash
# 依存関係インストール
make frontend-install

# フロントエンド全体チェック（TypeScript、テスト、リンティング）
make frontend-test

# 個別フロントエンドコマンド
make frontend-tsc          # TypeScriptチェック
make frontend-test-unit    # 単体テスト
make frontend-check        # 全パッケージのリンティング
make frontend-fix          # リンティング問題の自動修正

# PNPM経由のパッケージ固有コマンド
cd source/frontend && pnpm web run dev         # Web開発サーバー
cd source/frontend && pnpm blog-admin run dev  # 管理画面開発サーバー
```

## 型生成システム

OpenAPI 仕様書ベースの型自動生成により、バックエンド・フロントエンド間の型安全性を確保：

```bash
# 型生成（一括実行）
make generate-types

# 個別実行
make api-generate-openapi    # OpenAPI仕様書生成
make frontend-generate-types # TypeScript型生成
```

### 使用方法

```typescript
// 生成された型のインポート
import type { components, paths } from '@/generated';

// スキーマ型の使用
type BlogPost = components['schemas']['BlogPost'];
type Image = components['schemas']['Image'];

// APIエンドポイント型の使用
type GetBlogPostsResponse = 
  paths['/api/blog/posts/latest']['get']['responses']['200']['content']['application/json'];

type CreateBlogPostRequest = 
  paths['/api/admin/blog/posts']['post']['requestBody']['content']['application/json'];
```

### 重要事項

- **自動生成ファイル:** `source/frontend/packages/shared-lib/src/generated/api-types.ts` は手動編集禁止
- **Git管理:** 生成ファイルはGit管理対象です。バックエンドAPI変更時は `make generate-types` 実行後にコミット
- **型更新:** バックエンド API 変更後は必ず `make generate-types` を実行してから変更をコミット
- **統一エクスポート:** `@/generated` からのインポートを使用し、直接 `api-types.ts` をインポートしない

## フロントエンドアクセス

- **公開サイト:** `blog.example`
- **管理画面:** `admin.blog.example`

## 開発時の重要事項

- **フロントエンドワークスペース:** `/source/frontend/` ディレクトリから PNPM コマンドを使用し、ワークスペーススクリプトを活用
- **型安全性:** OpenAPI 仕様書から TypeScript 型を自動生成。手動型定義は非推奨

## コード品質

- **フロントエンド:** リンティングに `make frontend-check`、自動修正に `make frontend-fix` を実行
- **TypeScript:** ワークスペース全体の型チェックに `make frontend-tsc` を実行

## E2Eテスト配置

- **管理画面機能:** `source/frontend/packages/e2e/tests/admin/[機能名].feature`
- **公開サイト機能:** `source/frontend/packages/e2e/tests/web/[機能名].feature`

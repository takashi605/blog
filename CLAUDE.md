# CLAUDE.md

このファイルは Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

**重要:** ユーザーとのやり取りは日本語で行ってください。

## プロジェクト概要

個人用技術ブログアプリケーションの開発リポジトリです。Rust バックエンド API と TypeScript/Next.js フロントエンド（管理画面含む）で構成され、Kubernetes にデプロイし、開発には microK8s と Tilt を使用しています。

**アーキテクチャ:**

- **バックエンド:** Rust（Actix-web フレームワーク）、PostgreSQL データベース
- **フロントエンド:** Next.js（公開サイト + 管理画面）、PNPM ワークスペース構成
- **インフラ:** Kubernetes（microK8s）、Helm チャート、Tilt による開発環境
- **データベース:** PostgreSQL、SQLx マイグレーション
- **テスト:** Playwright による E2E テスト、単体テスト、API 統合テスト

## 開発コマンド

**重要:** 全ての `make` コマンドは必ず Makefile が存在する階層で実行してください。

### 環境セットアップ

```bash
# 完全な環境セットアップ（順番に実行）
make up-all-env

# Tiltによる開発環境の開始
make tilt-up

# 開発環境の停止
make tilt-down
```

### バックエンド開発

```bash
# v1 API（レガシー）
make api-test-run      # v1 APIテスト実行（単体 + 統合）
make api-test-unit     # v1 単体テストのみ実行
make api-sh            # v1 APIコンテナシェル
make api-test-sh       # v1 APIテストコンテナシェル

# v2 API（新アーキテクチャ）
make api-v2-test-run   # v2 APIテスト実行（単体 + 統合）
make api-v2-test-unit  # v2 単体テストのみ実行
make api-v2-sh         # v2 APIコンテナシェル
make api-v2-test-sh    # v2 APIテストコンテナシェル

# データベース操作（v1/v2共通）
make api-migrate-run           # マイグレーション実行
make api-migrate-revert        # 最新マイグレーションの取り消し
make postgres-recreate-schema  # データベーススキーマのリセット

# 新しいマイグレーション追加
make api-migrate-add-schema name=migration_name
make api-migrate-add-seeds name=seed_name
```

### フロントエンド開発

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

### テスト

```bash
# E2Eテスト
make e2e-run        # E2Eテスト実行
make e2e-run-ui     # E2EテストUI付き実行
make e2e-sh         # E2Eコンテナシェル

# 全テストスイート
make frontend-test    # フロントエンドテスト
make api-test-run     # v1 バックエンドテスト + APIテスト
make api-v2-test-run  # v2 バックエンドテスト + APIテスト
make e2e-run          # E2Eテスト
```

### コード品質

- **バックエンド:** API コンテナ内で `cargo test` と `cargo fmt` を使用
- **フロントエンド:** リンティングに `make frontend-check`、自動修正に `make frontend-fix` を実行
- **TypeScript:** ワークスペース全体の型チェックに `make frontend-tsc` を実行

### 型生成システム

OpenAPI 仕様書ベースの型自動生成により、バックエンド・フロントエンド間の型安全性を確保：

```bash
# 型生成（一括実行）
make generate-types

# 個別実行
make api-generate-openapi    # OpenAPI仕様書生成
make frontend-generate-types # TypeScript型生成
```

#### 使用方法

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

#### 重要事項

- **自動生成ファイル:** `source/frontend/packages/shared-interface-adapter/src/generated/api-types.ts` は手動編集禁止
- **Git管理:** 生成ファイルはGit管理対象です。バックエンドAPI変更時は `make generate-types` 実行後にコミット
- **型更新:** バックエンド API 変更後は必ず `make generate-types` を実行してから変更をコミット
- **統一エクスポート:** `@/generated` からのインポートを使用し、直接 `api-types.ts` をインポートしない

## プロジェクト構造

### バックエンド (`source/backend/`)

- **`api/`** - v1 API サービス（Actix-web、レガシー）
- **`api_v2/`** - v2 API サービス（Actix-web + OpenAPI + ドメインモデル）
- **`api_test/`** - v1 API 統合テスト
- **`api_v2_test/`** - v2 API 統合テスト
- **`common/`** - 共有型とユーティリティ
- **`domain/`** - ドメインモデルとビジネスロジック（v2 用）
- **データベースマイグレーション:** `api/migrations/schema/`（構造）と `api/migrations/seeds/`（データ）

### フロントエンド (`source/frontend/`)

PNPM ワークスペース構成のパッケージ:

- **`web/`** - 公開ブログインターフェース（Next.js）
- **`blog-admin/`** - コンテンツ管理用管理画面（Next.js）
- **`e2e/`** - Playwright E2E テスト
- **`entities/`, `service/`, `shared-interface-adapter/`** - ドメインロジックパッケージ
- **`shared-test-data/`** - テストユーティリティ

### インフラ

- **`k8s/blog-chart/`** - Kubernetes デプロイ用 Helm チャート
- **`containers/`** - 各サービス用 Docker ファイル
- **`Tiltfile`** - 開発環境設定

## 開発時の重要事項

- **データベース:** 型安全なデータベース操作に SQLx を使用。マイグレーションは必ず `make api-migrate-run` で実行
- **フロントエンドワークスペース:** `/source/frontend/` ディレクトリから PNPM コマンドを使用し、ワークスペーススクリプトを活用
- **Kubernetes:** サービスは `blog` 名前空間で動作。Pod アクセスやポートフォワーディングには `make` コマンドを使用
- **ライブリロード:** Tilt が開発中のフロントエンドとバックエンドの両方でライブリロードを提供
- **テスト戦略:** 単体テスト、API 統合テスト、E2E テストすべてが完了の条件
- **型安全性:** OpenAPI 仕様書から TypeScript 型を自動生成。手動型定義は非推奨

## サービスアクセス情報

### フロントエンドアクセス

- **公開サイト:** `blog.example`
- **管理画面:** `admin.blog.example`

### バックエンド API アクセス

- **公開サイト用 API:** `blog.example/api`
- **管理画面用 API:** `admin.blog.example/api`

## Git 戦略

### ブランチ命名規則

- **Product Backlog Item (PBI):** `PBI-SCRUM-111_任意の作業内容`
- **Sprint Backlog Item (SBI):** `SBI-SCRUM-123_任意の作業内容`
- 例: `PBI-SCRUM-001_add_user_authentication`、`SBI-SCRUM-045_fix_login_bug`

### コミットメッセージ

- ブランチ名に含まれる SCRUM 番号を含める（例: `SCRUM-111`）
- 形式: `SCRUM-111: 機能追加やバグ修正の説明`
- 例: `SCRUM-001: ユーザー認証機能を追加`、`SCRUM-045: ログインバグを修正`

## 開発フロー

このプロジェクトでは E2E テスト駆動開発（E2E TDD）を採用し、アウトサイドイン方式で機能を実装します。

### 1. E2E テスト設計・実装

1. **Gherkin シナリオ作成**

   - 機能要件を Gherkin 形式で記述
   - ユーザーストーリーの受け入れ条件を明確化
   - **配置場所:**
     - 管理画面機能: `source/frontend/packages/e2e/tests/admin/[機能名].feature`
     - 公開サイト機能: `source/frontend/packages/e2e/tests/web/[機能名].feature`

2. **E2E テストコード実装**
   - Playwright で E2E テストを実装
   - 対応するテストファイル: 同じディレクトリに `[機能名].spec.ts`
   - `make e2e-run` でテスト実行し、失敗することを確認（Red 状態）

### 2. 実装フェーズ

#### 2.1 フロントエンド実装

1. **モック設定**

   - 必要に応じて MSW に API モックを追加
   - 外部サービスとの統合テスト用モック設定

2. **TDD サイクル実行**
   - 各モジュールで以下を繰り返し:
     1. **Red**: 単体テスト作成・実行（失敗確認）
     2. **Green**: 最小限の実装でテスト通過
     3. **Refactor**: コード品質向上とリファクタリング

#### 2.2 バックエンド実装

1. **API 設計**

   - エンドポイント仕様策定
   - リクエスト/レスポンス形式定義

2. **API 統合テスト実装**

   - **配置場所:** `source/backend/api_test/src/tests/handlers/[リソース名]/[操作名].rs`
   - 例: `source/backend/api_test/src/tests/handlers/blog_posts/get.rs`
   - `make api-test-run` でテスト実行し、失敗確認（Red 状態）

3. **TDD サイクル実行**
   - 各モジュールで以下を繰り返し:
     1. **Red**: 単体テスト作成・実行（失敗確認）
     2. **Green**: 最小限の実装でテスト通過
     3. **Refactor**: コード品質向上とリファクタリング

### 3. 統合・完了

1. **E2E テスト確認**

   - `make e2e-run` で全 E2E テストが通過することを確認
   - テスト通過時: プルリクエスト作成
   - テスト失敗時: 問題修正後、再度テスト実行

2. **品質チェック**
   - `make frontend-test`: フロントエンド品質チェック
   - `make api-test-run`: バックエンド品質チェック
   - 全テストスイート通過後にプルリクエスト作成

### 開発時の注意点

- 各段階でテストファーストの原則を遵守
- リファクタリング時は既存テストの通過を維持
- E2E テストが開発の完了基準となる

### 作業単位でのコミット手順

大きな機能実装や修正作業は、小さな作業単位に分割して以下の手順を繰り返します：

1. **作業単位の実装完了**
   - フェーズではなくタスク単位での実装を完了

2. **テスト実行**
   ```bash
   # E2Eテスト実行
   make e2e-run
   
   # APIテスト実行
   make api-test-run
   
   # フロントエンドテスト実行
   make frontend-test
   ```

3. **テスト通過確認**
   - 全テストが通過することを確認
   - 失敗した場合は問題を修正してから次のステップに進む

4. **変更をコミット**
   ```bash
   git add [変更したファイル]
   git commit -m "作業内容の説明 SCRUM-XXX"
   ```

5. **次の作業単位に進む**
   - 上記手順を繰り返し、段階的に機能を完成させる

**メリット:**
- 問題の早期発見・修正
- コミット履歴の粒度適正化
- レビュー時の変更内容理解の向上
- ロールバック時の影響範囲の最小化

## アーキテクチャ変更計画

現在進行中のアーキテクチャ改善により、以下の変更を実施します：

### 1. エンティティ層のバックエンド移行

- **現状の問題**: フロントエンドにドメインロジックが配置され、データ変換が最大 6 回発生
- **対応策**: Rust 側にドメインモデルを集約し、データ変換回数を削減
- **実装方針**:
  - バックエンドに`domain/`モジュールを新設
  - エンティティとビジネスルールを Rust で実装
  - フロントエンドは軽量な ViewModel のみ保持

### 2. 画像アップロードの Proxy 化

- **現状の問題**: フロントエンドから直接 Cloudinary に接続、セキュリティリスク
- **対応策**: バックエンド経由での署名付きアップロード実装
- **実装方針**:
  - `/api/images/upload-signature` エンドポイントで署名生成
  - バックエンドで Cloudinary 署名付きアップロード制御
  - フロントエンドからの直接アクセス廃止

### 3. 型安全性の向上 (✅ 完了)

- **対応済み**: OpenAPI 仕様書ベースの型自動生成システム構築
- **実装済み**:
  - OpenAPI 仕様書から TypeScript 型を自動生成
  - Rust の構造体と TypeScript 型の一元管理
  - `make generate-types` でワンコマンド型生成
  - 既存 DTO と生成型の完全互換性確保
  - Discriminated Union の正常動作確認

これらの変更により、セキュリティ向上、パフォーマンス改善、保守性向上を実現します。

## v2 API 開発戦略

アーキテクチャ再設計では、既存 v1 API を維持しながら新規 v2 API を並行開発します。

### v2 API 設計方針

#### 1. 別コンテナ戦略

- **`source/backend/api_v2/`** - v1 をコピーして新アーキテクチャで再実装
- **Kubernetes ingress** - パスベースルーティングで`/api/v2/*`を v2 コンテナに転送
- **段階的移行** - v2 完成後、v1 削除して v2 を統合

#### 2. 技術スタック

- **OpenAPI 3.0** - `utoipa`クレートで Rust コードから自動生成
- **ドメインモデル** - `source/backend/domain/`にビジネスロジック集約
- **型安全性** - OpenAPI スキーマから TypeScript 型自動生成

#### 3. エンドポイント設計

```rust
// v2エンドポイント例
/api/v2/blog/posts          # ブログ記事CRUD
/api/v2/images/upload       # 画像プロキシアップロード
/api/v2/images/signature    # Cloudinary署名生成
```

#### 4. 移行計画

- **Phase 1**: v2 基盤構築・インフラ設定
- **Phase 2**: v2 API エンドポイント実装・フロントエンド v2 対応
- **Phase 3**: v1 削除・統合

#### 5. 品質保証

- **並行テスト** - E2E テスト実行
- **API 契約テスト** - OpenAPI スキーマとの整合性検証
- **段階的リリース** - 更新されたエンドポイントから段階的に接続先変更

この戦略により、リスクを最小化しながら確実にアーキテクチャ改善を実現します。

## 現在の作業

- 各フェーズごとにブランチを切ること
- 最低限、フェーズ内の各項番ごとにテスト・コミットすること
  - 例：フェーズ1-1 が完了したらテスト・コミット

### v2 API エンドポイントの構築

**ユーザーストーリー**: アプリケーション開発者として、v2 エンドポイントを用意したい。これは、再設計を安全に進めるためである。

**目標**: 既存 v1 API の機能を維持しながら、新しいアーキテクチャ基盤となる v2 API を構築し、段階的な移行を可能にする。

**作業計画**:

#### フェーズ 1: backend_v2 ディレクトリ全体の作成

1. **backend_v2 ディレクトリ全体のコピー**
   - `source/backend/` を `source/backend_v2/` にコピー
   - v1とv2の完全分離によるクリーンなアーキテクチャ実現

2. **backend_v2 ワークスペース設定**
   - `source/backend_v2/Cargo.toml` のメンバーを `["api_v2", "api_v2_test", "common"]` に変更
   - v2専用の独立したワークスペースを構築

3. **ディレクトリ名変更とパッケージ設定**
   - `backend_v2/api/` → `backend_v2/api_v2/` にリネーム
   - `backend_v2/api_test/` → `backend_v2/api_v2_test/` にリネーム
   - 各 Cargo.toml でパッケージ名を `blog-api-v2`, `blog-api-v2-test` に変更
   - サーバー起動ポートを 8001 に変更（ポート競合回避）
   - テスト接続先を `localhost:8001` に変更

4. **v2 専用 Dockerfile の作成**
   - `containers/backend/api_v2/Dockerfile` を作成
   - `ARG APP_ROOT_DIR=source/backend_v2` で v2 ディレクトリのみ参照
   - v1 との依存関係を完全に排除

#### フェーズ 2: インフラストラクチャ対応

5. **Kubernetes 設定の追加**
   - `k8s/blog-chart/templates/backend/api_v2/` ディレクトリを作成
   - deployment.yaml: v2専用設定で作成、backend_v2ディレクトリを参照
   - service.yaml: ポート 8001 で v2 API にアクセス可能にする
   - values.yaml に v2 API 用の設定を追加

6. **Ingress 設定の更新**
   - `/api/v2/*` パスを v2 API サービス（ポート8001）に転送するルールを追加
   - rewrite-target で `/api/v2/xxx` → `/xxx` に URL 変換
   - 既存の `/api/*` ルール（v1）は維持

7. **Tilt と Makefile の更新**
   - Tiltfile に v2 API コンテナビルド設定を追加（backend_v2ディレクトリ使用）
   - Makefile に v2 API 関連コマンド追加：`make api-v2-sh`, `make api-v2-test-run` 等

#### フェーズ 3: v2 エンドポイント修正

8. **v2 API エンドポイントパスの修正**
   - エンドポイントパスは v1 と同じ（`/blog/*`, `/admin/*`, `/images/*`）を維持
   - `/openapi.json` エンドポイントを追加
   - Ingress の rewrite-target で `/api/v2/*` → `/*` に変換されるため

9. **v2 テストエンドポイントの修正**
   - テストコード内の接続先を `localhost:8001` に変更
   - エンドポイントパス自体は v1 と同じ（`/admin/blog/posts` 等）

#### フェーズ 4: フロントエンドの v2 移行

10. **記事単一取得の v2 移行**
    - 公開サイト（`web/`）の記事詳細取得を `/api/v2/blog/posts/{slug}` に変更
    - 管理画面（`blog-admin/`）の記事編集取得を `/api/v2/blog/posts/{slug}` に変更
    - 型生成の更新（v2 エンドポイント対応）

11. **動作確認とテスト**
    - `make api-v2-test-run` で v2 API テストが通過することを確認
    - `make e2e-run` で E2E テストが通過することを確認
    - v1 API が引き続き動作することを確認

**受け入れ基準**:

- ✅ 既存の api の全エンドポイントが v2 として存在すること
- ✅ v2 用の api テストが既存のものと同じで、v2 に対して実行されていること
- ✅ 記事の単一取得エンドポイントを v2 のものに置き換えていること
- ✅ 全ての E2E テストが通過すること
- ✅ v1 API の機能が引き続き動作すること

#### フェーズ 5: 全エンドポイントのv2一括移行

12. **全フロントエンドエンドポイントのv2移行**
    - 公開サイト（`web/`）の環境変数を `/api/v2` に変更
    - 管理画面（`blog-admin/`）の環境変数を `/api/v2` に変更
    - 全APIリクエストがv2 APIに統一される

13. **型生成のv2統一**
    - `make generate-types` でv2 APIからOpenAPI仕様書とTypeScript型を生成
    - フロントエンド全体でv2ベースの型定義を使用

14. **全機能動作確認**
    - `make api-v2-test-run` で v2 API テストが通過することを確認
    - `make e2e-run` で全 E2E テストが通過することを確認
    - 公開サイトと管理画面の全機能が正常動作することを確認

15. **v1 API削除準備**
    - v1 APIコンテナの停止確認
    - v1関連設定の整理
    - v2 APIのみでの安定動作確認

**フェーズ5受け入れ基準**:

- ✅ フロントエンド全体がv2 APIのみを使用していること
- ✅ 全エンドポイントがv2経由で正常動作すること
- ✅ 全 E2E テストが通過すること（15/15シナリオ成功）
- ✅ TypeScript型がv2 API仕様書ベースで生成されていること
- ✅ v1 APIに依存しない完全なv2環境が構築されていること

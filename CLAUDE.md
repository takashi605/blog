# CLAUDE.md

このファイルはClaude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

**重要:** ユーザーとのやり取りは日本語で行ってください。

## プロジェクト概要

個人用技術ブログアプリケーションの開発リポジトリです。RustバックエンドAPIとTypeScript/Next.jsフロントエンド（管理画面含む）で構成され、Kubernetesにデプロイし、開発にはmicroK8sとTiltを使用しています。

**アーキテクチャ:**
- **バックエンド:** Rust（Actix-webフレームワーク）、PostgreSQLデータベース
- **フロントエンド:** Next.js（公開サイト + 管理画面）、PNPMワークスペース構成  
- **インフラ:** Kubernetes（microK8s）、Helmチャート、Tiltによる開発環境
- **データベース:** PostgreSQL、SQLxマイグレーション
- **テスト:** PlaywrightによるE2Eテスト、単体テスト、API統合テスト

## 開発コマンド

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
# APIテスト実行（単体 + 統合）
make api-test-run

# 単体テストのみ実行
make api-test-unit

# データベース操作
make api-migrate-run           # マイグレーション実行
make api-migrate-revert        # 最新マイグレーションの取り消し
make postgres-recreate-schema  # データベーススキーマのリセット

# 新しいマイグレーション追加
make api-migrate-add-schema name=migration_name
make api-migrate-add-seeds name=seed_name

# バックエンドコンテナアクセス
make api-sh        # APIコンテナシェル
make api-test-sh   # APIテストコンテナシェル
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
make frontend-test  # フロントエンドテスト
make api-test-run   # バックエンドテスト + APIテスト
make e2e-run        # E2Eテスト
```

### コード品質
- **バックエンド:** APIコンテナ内で `cargo test` と `cargo fmt` を使用
- **フロントエンド:** リンティングに `make frontend-check`、自動修正に `make frontend-fix` を実行
- **TypeScript:** ワークスペース全体の型チェックに `make frontend-tsc` を実行

## プロジェクト構造

### バックエンド (`source/backend/`)
- **`api/`** - Actix-webハンドラーを持つメインAPIサービス
- **`api_test/`** - APIエンドポイントの統合テスト
- **`common/`** - 共有型とユーティリティ
- **データベースマイグレーション:** `api/migrations/schema/`（構造）と `api/migrations/seeds/`（データ）

### フロントエンド (`source/frontend/`)
PNPMワークスペース構成のパッケージ:
- **`web/`** - 公開ブログインターフェース（Next.js）
- **`blog-admin/`** - コンテンツ管理用管理画面（Next.js）
- **`e2e/`** - Playwright E2Eテスト
- **`entities/`, `service/`, `shared-interface-adapter/`** - ドメインロジックパッケージ
- **`shared-test-data/`** - テストユーティリティ

### インフラ
- **`k8s/blog-chart/`** - Kubernetesデプロイ用Helmチャート
- **`containers/`** - 各サービス用Dockerファイル
- **`Tiltfile`** - 開発環境設定

## 開発時の重要事項

- **データベース:** 型安全なデータベース操作にSQLxを使用。マイグレーションは必ず `make api-migrate-run` で実行
- **フロントエンドワークスペース:** `/source/frontend/` ディレクトリからPNPMコマンドを使用し、ワークスペーススクリプトを活用
- **Kubernetes:** サービスは `blog` 名前空間で動作。Podアクセスやポートフォワーディングには `make` コマンドを使用
- **ライブリロード:** Tiltが開発中のフロントエンドとバックエンドの両方でライブリロードを提供
- **テスト戦略:** 単体テスト、API統合テスト、E2Eテストすべてが完了の条件

## Git 戦略

### ブランチ命名規則
- **Product Backlog Item (PBI):** `PBI-SCRUM-111_任意の作業内容`
- **Sprint Backlog Item (SBI):** `SBI-SCRUM-123_任意の作業内容`
- 例: `PBI-SCRUM-001_add_user_authentication`、`SBI-SCRUM-045_fix_login_bug`

### コミットメッセージ
- ブランチ名に含まれるSCRUM番号を含める（例: `SCRUM-111`）
- 形式: `SCRUM-111: 機能追加やバグ修正の説明`
- 例: `SCRUM-001: ユーザー認証機能を追加`、`SCRUM-045: ログインバグを修正`

## 開発フロー

このプロジェクトではE2Eテスト駆動開発（E2E TDD）を採用し、アウトサイドイン方式で機能を実装します。

### 1. E2Eテスト設計・実装
1. **Gherkinシナリオ作成**
   - 機能要件をGherkin形式で記述
   - ユーザーストーリーの受け入れ条件を明確化
   - **配置場所:**
     - 管理画面機能: `source/frontend/packages/e2e/tests/admin/[機能名].feature`
     - 公開サイト機能: `source/frontend/packages/e2e/tests/web/[機能名].feature`

2. **E2Eテストコード実装**
   - PlaywrightでE2Eテストを実装
   - 対応するテストファイル: 同じディレクトリに `[機能名].spec.ts`
   - `make e2e-run` でテスト実行し、失敗することを確認（Red状態）

### 2. 実装フェーズ

#### 2.1 フロントエンド実装
1. **モック設定**
   - 必要に応じてMSWにAPIモックを追加
   - 外部サービスとの統合テスト用モック設定

2. **TDDサイクル実行**
   - 各モジュールで以下を繰り返し:
     1. **Red**: 単体テスト作成・実行（失敗確認）
     2. **Green**: 最小限の実装でテスト通過
     3. **Refactor**: コード品質向上とリファクタリング

#### 2.2 バックエンド実装
1. **API設計**
   - エンドポイント仕様策定
   - リクエスト/レスポンス形式定義

2. **API統合テスト実装**
   - **配置場所:** `source/backend/api_test/src/tests/handlers/[リソース名]/[操作名].rs`
   - 例: `source/backend/api_test/src/tests/handlers/blog_posts/get.rs`
   - `make api-test-run` でテスト実行し、失敗確認（Red状態）

3. **TDDサイクル実行**
   - 各モジュールで以下を繰り返し:
     1. **Red**: 単体テスト作成・実行（失敗確認）
     2. **Green**: 最小限の実装でテスト通過
     3. **Refactor**: コード品質向上とリファクタリング

### 3. 統合・完了
1. **E2Eテスト確認**
   - `make e2e-run` で全E2Eテストが通過することを確認
   - テスト通過時: プルリクエスト作成
   - テスト失敗時: 問題修正後、再度テスト実行

2. **品質チェック**
   - `make frontend-test`: フロントエンド品質チェック
   - `make api-test-run`: バックエンド品質チェック
   - 全テストスイート通過後にプルリクエスト作成

### 開発時の注意点
- 各段階でテストファーストの原則を遵守
- リファクタリング時は既存テストの通過を維持
- E2Eテストが開発の完了基準となる
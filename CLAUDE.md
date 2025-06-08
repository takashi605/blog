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
- **バックエンド:** APIコンテナ内で `cargo test` と `cargo fmt` を使用
- **フロントエンド:** リンティングに `make frontend-check`、自動修正に `make frontend-fix` を実行
- **TypeScript:** ワークスペース全体の型チェックに `make frontend-tsc` を実行

## プロジェクト構造

### バックエンド (`source/backend/`)
- **`api/`** - v1 APIサービス（Actix-web、レガシー）
- **`api_v2/`** - v2 APIサービス（Actix-web + OpenAPI + ドメインモデル）
- **`api_test/`** - v1 API統合テスト
- **`api_v2_test/`** - v2 API統合テスト
- **`common/`** - 共有型とユーティリティ
- **`domain/`** - ドメインモデルとビジネスロジック（v2用）
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

## アーキテクチャ変更計画

現在進行中のアーキテクチャ改善により、以下の変更を実施中です：

### 1. エンティティ層のバックエンド移行
- **現状の問題**: フロントエンドにドメインロジックが配置され、データ変換が最大6回発生
- **対応策**: Rust側にドメインモデルを集約し、データ変換回数を削減
- **実装方針**:
  - バックエンドに`domain/`モジュールを新設
  - エンティティとビジネスルールをRustで実装
  - フロントエンドは軽量なViewModelのみ保持

### 2. 画像アップロードのProxy化
- **現状の問題**: フロントエンドから直接Cloudinaryに接続、セキュリティリスク
- **対応策**: バックエンド経由での署名付きアップロード実装
- **実装方針**:
  - `/api/images/upload-signature` エンドポイントで署名生成
  - バックエンドでCloudinary署名付きアップロード制御
  - フロントエンドからの直接アクセス廃止

### 3. 型安全性の向上
- **現状の問題**: バックエンドとフロントエンドで型定義が重複・不整合
- **対応策**: スキーマ共有による型整合性確保
- **実装方針**:
  - OpenAPI仕様書からTypeScript型を自動生成
  - Rustの構造体とTypeScript型の一元管理
  - ランタイム型検証の簡素化

これらの変更により、セキュリティ向上、パフォーマンス改善、保守性向上を実現します。

## v2 API開発戦略

アーキテクチャ再設計では、既存v1 APIを維持しながら新規v2 APIを並行開発します。

### v2 API設計方針

#### 1. 別コンテナ戦略
- **`source/backend/api_v2/`** - v1をコピーして新アーキテクチャで再実装
- **Kubernetes ingress** - パスベースルーティングで`/api/v2/*`をv2コンテナに転送
- **段階的移行** - v2完成後、v1削除してv2を統合

#### 2. 技術スタック
- **OpenAPI 3.0** - `utoipa`クレートでRustコードから自動生成
- **ドメインモデル** - `source/backend/domain/`にビジネスロジック集約
- **型安全性** - OpenAPIスキーマからTypeScript型自動生成

#### 3. エンドポイント設計
```rust
// v2エンドポイント例
/api/v2/blog/posts          # ブログ記事CRUD
/api/v2/images/upload       # 画像プロキシアップロード  
/api/v2/images/signature    # Cloudinary署名生成
```

#### 4. 移行計画
- **Phase 1**: v2基盤構築・インフラ設定
- **Phase 2**: v2 APIエンドポイント実装・フロントエンド v2対応
- **Phase 3**: v1削除・統合

#### 5. 品質保証
- **並行テスト** - E2Eテスト実行
- **API契約テスト** - OpenAPIスキーマとの整合性検証
- **段階的リリース** - 更新されたエンドポイントから段階的に接続先変更

この戦略により、リスクを最小化しながら確実にアーキテクチャ改善を実現します。
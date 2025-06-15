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

### バックエンド (`source/backend_v2/`)
詳細な情報は [source/backend_v2/BACKEND.md](source/backend_v2/BACKEND.md) を参照してください。

- **`api_v2/`** - v2 API サービス（Actix-web + OpenAPI + ドメインモデル）
- **`api_v2_test/`** - v2 API 統合テスト
- **`common/`** - 共有型とユーティリティ
- **`domain/`** - ドメインモデルとビジネスロジック（v2 用）
- **データベースマイグレーション:** `api/migrations/schema/`（構造）と `api/migrations/seeds/`（データ）

### フロントエンド (`source/frontend/`)
詳細な情報は [source/frontend/FRONTEND.md](source/frontend/FRONTEND.md) を参照してください。

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

   - **配置場所:** `source/backend_v2/api_v2_test/src/tests/handlers/[リソース名]/[操作名].rs`
   - 例: `source/backend_v2/api_v2_test/src/tests/handlers/blog_posts/get.rs`
   - `make api-v2-test-run` でテスト実行し、失敗確認（Red 状態）

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
- コメントやログに出力する内容は日本語で記載する

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

### 4. v2 API への完全移行 (✅ 完了)

- **対応済み**: v1 API から v2 API への段階的移行を完了
- **実装済み**:
  - backend_v2 ディレクトリによる v1/v2 分離アーキテクチャ構築
  - Kubernetes Ingress による `/api/v2/*` パスルーティング設定
  - フロントエンド全体の v2 API エンドポイント統一
  - v2 API ベースの型生成システム統合
  - 全 E2E テスト（15/15シナリオ）の通過確認
  - v1 API に依存しない完全な v2 環境の実現

これらの変更により、セキュリティ向上、パフォーマンス改善、保守性向上を実現します。

詳細なアーキテクチャ情報については、以下のファイルを参照してください：
- **バックエンド:** [source/backend_v2/BACKEND.md](source/backend_v2/BACKEND.md)
- **フロントエンド:** [source/frontend/FRONTEND.md](source/frontend/FRONTEND.md)

## 現在の作業
**重要**: backend と示されているものは backend_v2 ディレクトリを指します。backend ディレクトリは触らず、backend_v2 ディレクトリに対して各作業を行ってください。

### アーキテクチャ再設計プラン

現在、バックエンドとフロントエンドの大規模なアーキテクチャ再設計を実施中です。APIインターフェースを維持しながら、内部実装を段階的に改善していきます。

### 再設計の基本方針

1. **APIインターフェースの維持**: 既存のエンドポイント、リクエスト/レスポンス形式は変更しない
2. **テストの継続的パス**: E2Eテストとapi_v2_testは常に通過する状態を維持
3. **段階的移行**: 各フェーズで動作確認しながら進める

### フェーズ定義

#### Phase 1: バックエンドとフロントエンドの境界再構築

**目的**: 既存のAPIインターフェースを維持しながら、内部アーキテクチャの準備を行う

**実装計画**:
1. **APIレスポンス型の分離と共有化**
   - [x] 現在のBlogPostResponse等の型定義をcommonクレートに移動
   - [x] api_v2とapi_v2_testで同じ型を共有
   - [x] 型の互換性テストの作成

2. **3層アーキテクチャのディレクトリ構造作成**
   - [x] domain/、application/、infrastructure/ディレクトリの作成
   - [x] 既存コードはそのまま維持（v1コンテナがロールバック先として機能）
   - [x] 新アーキテクチャのコードを段階的に追加

3. **アプリケーション層の内部DTO準備**
   - [x] アプリケーション層に将来のドメイン↔アプリケーション間DTO用モジュール作成
   - [x] 変換インターフェース用トレイト定義（将来の拡張に備え）
   - [x] レスポンス型はcommonクレートに残してAPIインターフェース維持

#### Phase 2: バックエンド内部再設計

**目的**: APIインターフェースを変えずに、DDDベースの3層アーキテクチャを実装

**実装計画（ユースケースベース）**:

1. **記事閲覧ユースケース（ViewBlogPost）**
   - [x] BlogPostEntity（ID、Title、Content等）の実装（命名規則: XxxEntity）
   - [x] BlogPostリポジトリインターフェース定義（fetch(id)メソッド）
   - [x] SQLxリポジトリ実装（単一記事取得）
   - [x] ViewBlogPostユースケース実装
   - [ ] GET /api/v2/blog/posts/{id} ハンドラーの新アーキテクチャ移行
   - [ ] api_v2_testの該当テスト通過確認

2. **新着記事一覧取得ユースケース（ViewLatestBlogPosts）**
   - [ ] BlogPostコレクション型の実装
   - [x] リポジトリインターフェースにfetchLatests(limit)メソッド追加
   - [ ] SQLxリポジトリ実装（複数記事取得、ソート対応）
   - [ ] ViewLatestBlogPostsユースケース実装
   - [ ] GET /api/v2/blog/posts/latest ハンドラーの新アーキテクチャ移行
   - [ ] api_v2_testの該当テスト通過確認

3. **記事投稿ユースケース（CreateBlogPost）**
   - [ ] BlogPost生成ロジック（ID生成、日付設定）の実装
   - [x] リポジトリインターフェースにsave(post)メソッド追加
   - [ ] SQLxリポジトリ実装（記事保存）
   - [ ] CreateBlogPostユースケース実装
   - [ ] POST /api/v2/admin/blog/posts ハンドラーの新アーキテクチャ移行
   - [ ] api_v2_testの該当テスト通過確認

4. **画像登録ユースケース（CreateImage）**
   - [x] ImageEntity（ID、Path）の実装（命名規則: XxxEntity）
   - [ ] ImageリポジトリインターフェースとSQLx実装
   - [ ] CreateImageユースケース実装
   - [ ] POST /api/v2/admin/images ハンドラーの新アーキテクチャ移行
   - [ ] api_v2_testの該当テスト通過確認

5. **全画像取得ユースケース（ViewImages）**
   - [ ] ImageリポジトリにfindAll()メソッド追加
   - [ ] SQLxリポジトリ実装（全画像取得）
   - [ ] ViewImagesユースケース実装
   - [ ] GET /api/v2/admin/images ハンドラーの新アーキテクチャ移行
   - [ ] api_v2_testの該当テスト通過確認

6. **人気記事関連ユースケース（ViewPopularBlogPosts/SelectPopularPosts）**
   - [ ] 人気記事選択ロジックの実装
   - [x] リポジトリインターフェースに人気記事関連メソッド追加
   - [ ] SQLxリポジトリ実装（人気記事の取得・更新）
   - [ ] ViewPopularBlogPostsとSelectPopularPostsユースケース実装
   - [ ] 関連エンドポイントの新アーキテクチャ移行
   - [ ] api_v2_testの該当テスト通過確認

7. **ピックアップ記事ユースケース（ViewPickUpPost）**
   - [ ] ピックアップ記事取得ロジックの実装
   - [x] リポジトリインターフェースにfetchPickUpPosts(limit)メソッド追加
   - [ ] SQLxリポジトリ実装
   - [ ] ViewPickUpPostユースケース実装
   - [ ] GET /api/v2/blog/posts/pick-up ハンドラーの新アーキテクチャ移行
   - [ ] api_v2_testの該当テスト通過確認

8. **トップテック記事関連ユースケース（ViewTopTechPick/SelectTopTechPickPost）**
   - [ ] TopTechPickSelectorビジネスロジックの実装
   - [x] リポジトリインターフェースにトップテック記事関連メソッド追加
   - [ ] SQLxリポジトリ実装
   - [ ] ViewTopTechPickとSelectTopTechPickPostユースケース実装
   - [ ] 関連エンドポイントの新アーキテクチャ移行
   - [ ] api_v2_testの該当テスト通過確認

9. **共通基盤の整備**
   - [ ] DIコンテナ（依存性注入）の実装
   - [x] ドメインエラー定義とエラーハンドリング（命名規則に従った実装）
   - [x] ドメインエンティティとVO構造の基盤作成（blog_domain.rs, image_domain.rs）
   - [x] ドメインエンティティ ⇔ DBレコード変換ロジック
   - [ ] 全api_v2_testの通過確認

#### Phase 3: フロントエンド内部再設計

**目的**: APIインターフェースはそのままに、フロントエンドを軽量化

**実装計画**:
1. **shared-libパッケージの構築**
   - [ ] 既存のAPIレスポンス型を活用するViewModel定義
   - [ ] APIクライアント実装（既存エンドポイント対応）
   - [ ] 軽量な変換関数実装

2. **段階的な依存関係の移行**
   - [ ] 既存のentities/serviceをshared-libで置き換え
   - [ ] カスタムフックでusecasesを置き換え
   - [ ] コンポーネントごとに段階的移行

3. **既存パッケージの削除**
   - [ ] 全ての依存が移行完了後に削除
   - [ ] TypeScriptコンパイルエラーの解消
   - [ ] E2Eテストの継続的パス確認

#### Phase 4: 統合と最適化

**目的**: 必要に応じてAPIインターフェースを最適化し、全体を統合

**実装計画**:
1. **APIインターフェースの見直し（オプション）**
   - [ ] 新アーキテクチャに最適なレスポンス形式の検討
   - [ ] 必要な場合のみ、APIバージョニングの実施
   - [ ] E2Eテスト・api_v2_testの更新

2. **パフォーマンス最適化**
   - [ ] 不要なデータ変換の削除
   - [ ] N+1問題の解決
   - [ ] キャッシュ戦略の実装

3. **最終的な品質保証**
   - [ ] 全テストスイートの通過確認
   - [ ] パフォーマンステスト
   - [ ] セキュリティレビュー

### 重要な制約事項

1. **各フェーズでE2Eテストとapi_v2_testが通過すること**
2. **APIのエンドポイント、リクエスト/レスポンス形式は原則変更しない**
3. **破壊的変更は避け、段階的な移行を行う**
4. **各エンドポイントの切り替え後は必ずテストを実行**

### 現在のステータス

**現在作業中**: Phase 2-4 - ViewBlogPostユースケース完了 → GET /api/v2/blog/posts/{id} ハンドラー移行開始

**Phase 2-1 完了事項**:
- DDDベースのドメイン構造実装（blog_domain.rs, image_domain.rs）
- 命名規則適用（XxxEntity, XxxVO）
- mod.rs廃止とmodule_name.rs採用
- BlogPostEntityとImageEntityの完全実装
- RichTextVOとその関連値オブジェクトの実装
- 包括的なテストスイート（12テスト）の成功

**Phase 2-2 完了事項**:
- BlogPostRepositoryトレイト定義（全9メソッド実装）
- async-trait依存関係追加
- フロントエンドApiBlogPostRepositoryとの完全対応
- 全APIテスト（25+24件）通過確認

**Phase 2-3 完了事項**:
- infrastructure/blog_post_sqlx_repository/tables/ にテーブルマッピング型をモジュール化
- infrastructure/blog_post_sqlx_repository/converter.rs で型安全なDBレコード⇔ドメインエンティティ変換システム実装
- infrastructure/db_pool.rs でDI対応のDB接続プール管理追加
- BlogPostSqlxRepository::find() メソッドの完全実装（単一記事取得）
- リッチテキスト、スタイル、リンク情報を含む複雑なコンテンツ構造の適切な変換
- 不要なClone deriveを削除してRustのmove semanticsを適切に活用
- 包括的なテストスイートとエラーハンドリングの実装

**Phase 2-4 完了事項**:
- ViewBlogPostDTOの完全実装（記事閲覧用データ転送オブジェクト）
- ViewBlogPostUseCaseのTDD実装完了（Red-Green-Refactorサイクル）
- アプリケーション層の再構成（application.rs採用、mod.rs廃止徹底）
- BlogPostEntityからViewBlogPostDTOへの変換ロジック実装
- モックリポジトリを使用した包括的な単体テスト
- 変換ロジックの分離とコード品質向上（リファクタリング完了）

### 進捗追跡

作業の進捗は、各タスク完了時にチェックボックスを更新します。各フェーズの完了時には、全てのテストが通過することを確認してから次のフェーズに進みます。

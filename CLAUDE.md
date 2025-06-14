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

### バックエンド (`source/backend_v2/`)
- **`api_v2/`** - v2 API サービス（Actix-web + OpenAPI + ドメインモデル）
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
- **現在の問題点**:
  
  データ変換の多重発生:
  1. API Response JSON → BlogPostDTO（スキーマ検証）
  2. BlogPostDTO → BlogPost Entity（ユースケース層）
  3. BlogPost Entity → BlogPostDTO（ユースケース層）
  4. BlogPostDTO → JSON（API送信時）

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

### バックエンド3層アーキテクチャ再設計

#### 設計方針
ドメイン駆動設計（DDD）に基づく3層アーキテクチャを採用し、責務分離とビジネスロジックの集約を実現します。

#### 1. エンティティ層（Domain Layer）
- **ドメインエンティティ**: `BlogPost`, `Image`, `Content`等のビジネスオブジェクト
- **値オブジェクト**: `BlogPostId`, `Title`, `BlogPostDates`等の不変オブジェクト
- **リポジトリインターフェース**: データアクセスの抽象化
- **ドメインエラー**: ビジネスルール違反のエラー定義

```rust
// src/domain/entities/blog_post.rs
pub struct BlogPost {
    id: BlogPostId,
    title: Title,
    thumbnail: Image,
    contents: Vec<Content>,
    dates: BlogPostDates,
}

impl BlogPost {
    pub fn new(id: BlogPostId, title: Title) -> Result<Self> {
        title.validate()?;  // ビジネスルール検証
        Ok(Self { id, title, ... })
    }
}

// src/domain/repositories/blog_post_repository.rs
pub trait BlogPostRepository {
    async fn find_by_id(&self, id: BlogPostId) -> Result<Option<BlogPost>>;
    async fn find_latest(&self, limit: Option<usize>) -> Result<Vec<BlogPost>>;
    async fn save(&self, blog_post: &BlogPost) -> Result<()>;
}
```

#### 2. ユースケース層（Application Layer）
- **ユースケース**: アプリケーション固有のビジネスプロセス
- **依存性注入**: リポジトリインターフェースに依存

```rust
// src/application/use_cases/get_blog_post.rs
pub struct GetBlogPostUseCase {
    blog_post_repo: Box<dyn BlogPostRepository>,
}

impl GetBlogPostUseCase {
    pub async fn execute(&self, id: BlogPostId) -> Result<BlogPost> {
        self.blog_post_repo
            .find_by_id(id)
            .await?
            .ok_or(DomainError::BlogPostNotFound(id))
    }
}
```

#### 3. インフラ層（Infrastructure Layer）
- **リポジトリ実装**: SQLxを使用したデータベースアクセス
- **Webハンドラー**: HTTP リクエスト/レスポンス処理
- **レスポンスDTO**: API契約（commonクレートで共有）

```rust
// src/infrastructure/repositories/sqlx_blog_post_repository.rs
impl BlogPostRepository for SqlxBlogPostRepository {
    async fn find_by_id(&self, id: BlogPostId) -> Result<Option<BlogPost>> {
        let record = fetch_blog_post_by_id(&self.pool, id.value()).await?;
        Ok(Some(self.record_to_entity(record)?))
    }
}

// src/infrastructure/web/handlers/blog_post_handler.rs
impl BlogPostHandler {
    pub async fn get_blog_post(&self, path: web::Path<String>) -> Result<impl Responder> {
        let id = BlogPostId::from_str(&path)?;
        let blog_post = self.get_blog_post_use_case.execute(id).await?;
        let response = BlogPostResponse::from(blog_post);
        Ok(HttpResponse::Ok().json(response))
    }
}
```

#### ディレクトリ構造

```
source/backend_v2/
├── common/                  # 共有型定義
│   └── src/types/api/response.rs  # APIレスポンス型（テスト共有）
├── api_v2/
│   └── src/
│       ├── domain/          # エンティティ層
│       │   ├── entities/    # ドメインエンティティ
│       │   ├── value_objects/ # 値オブジェクト
│       │   ├── repositories/ # リポジトリインターフェース
│       │   └── errors.rs    # ドメインエラー
│       ├── application/     # ユースケース層
│       │   └── use_cases/   # アプリケーションユースケース
│       └── infrastructure/  # インフラ層
│           ├── repositories/ # リポジトリ実装
│           ├── web/         # Webインターフェース
│           └── database/    # DBモデル・マイグレーション
└── api_v2_test/            # APIテスト（commonレスポンス型使用）
```

#### データフロー

```
[Database] → Repository Impl → Domain Entity → Use Case → Handler → Response DTO → JSON
```

**変換回数**: 3回（DB→Entity、Entity→Response、Response→JSON）

#### 主な改善点

1. **責務分離**: 各層の役割が明確に分離
2. **ビジネスルール集約**: ドメインエンティティにビジネスロジック集約
3. **テストしやすさ**: 各層が独立してテスト可能
4. **型安全性**: ドメインオブジェクトでの型安全性確保
5. **保守性**: 変更時の影響範囲が限定的
6. **共有型定義**: commonクレートでAPIテストとの型共有

#### エラーハンドリング戦略

##### 1. エラー分類と配置

```rust
// src/domain/errors.rs - ドメインエラー
use anyhow::{Result, Context};

#[derive(Debug)]
pub enum DomainError {
    BlogPostNotFound(BlogPostId),
    InvalidTitle(String),
    InvalidContent(String),
    ThumbnailNotSet,
    ValidationFailed(String),
}

impl std::fmt::Display for DomainError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DomainError::BlogPostNotFound(id) => write!(f, "ブログ記事が見つかりません: {}", id),
            DomainError::InvalidTitle(msg) => write!(f, "タイトルが無効です: {}", msg),
            DomainError::InvalidContent(msg) => write!(f, "コンテンツが無効です: {}", msg),
            DomainError::ThumbnailNotSet => write!(f, "サムネイル画像が設定されていません"),
            DomainError::ValidationFailed(msg) => write!(f, "バリデーションに失敗しました: {}", msg),
        }
    }
}

impl std::error::Error for DomainError {}

// Result型のエイリアス
pub type DomainResult<T> = Result<T>;
```

##### 2. 各層でのエラー処理方針

- **ドメイン層**: ビジネスルール違反を明確に表現し、下位層へエラーを依存させない
- **アプリケーション層**: ドメインエラーをそのまま伝播、必要に応じて追加コンテキストを付与
- **インフラ層**: 外部システムエラーを適切にドメインエラーまたはインフラエラーにマッピング

##### 3. HTTPレスポンスマッピング

```rust
// src/infrastructure/web/error_mapping.rs
use actix_web::{HttpResponse, ResponseError, http::StatusCode};
use anyhow::Error;
use serde::Serialize;
use crate::domain::errors::DomainError;

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
    pub code: String,
    pub details: Option<String>,
}

// カスタムエラーラッパー
#[derive(Debug)]
pub struct AppError(anyhow::Error);

impl From<anyhow::Error> for AppError {
    fn from(err: anyhow::Error) -> Self {
        AppError(err)
    }
}

impl From<DomainError> for AppError {
    fn from(err: DomainError) -> Self {
        AppError(anyhow::Error::from(err))
    }
}

impl ResponseError for AppError {
    fn error_response(&self) -> HttpResponse {
        // ルートエラーがDomainErrorかチェック
        if let Some(domain_error) = self.0.downcast_ref::<DomainError>() {
            let (status_code, error_code) = match domain_error {
                DomainError::BlogPostNotFound(_) => (StatusCode::NOT_FOUND, "BLOG_POST_NOT_FOUND"),
                DomainError::InvalidTitle(_) => (StatusCode::BAD_REQUEST, "INVALID_TITLE"),
                DomainError::InvalidContent(_) => (StatusCode::BAD_REQUEST, "INVALID_CONTENT"),
                DomainError::ThumbnailNotSet => (StatusCode::BAD_REQUEST, "THUMBNAIL_NOT_SET"),
                DomainError::ValidationFailed(_) => (StatusCode::BAD_REQUEST, "VALIDATION_FAILED"),
            };

            let error_response = ErrorResponse {
                error: domain_error.to_string(),
                code: error_code.to_string(),
                details: None,
            };

            HttpResponse::build(status_code).json(error_response)
        } else {
            // その他のエラーは内部サーバーエラーとして処理
            let error_response = ErrorResponse {
                error: "内部サーバーエラーが発生しました".to_string(),
                code: "INTERNAL_SERVER_ERROR".to_string(),
                details: None,
            };

            HttpResponse::InternalServerError().json(error_response)
        }
    }
}
```

##### 4. エラー伝播パターンと層別責務

```rust
// === データベース層（インフラ層の最下層） ===
// src/infrastructure/database/blog_post_queries.rs
use sqlx::{PgPool, Error as SqlxError};

// データベース層は純粋にSQLxエラーを返す
pub async fn fetch_blog_post_by_id(pool: &PgPool, id: Uuid) -> Result<Option<BlogPostRecord>, SqlxError> {
    let record = sqlx::query_as::<_, BlogPostRecord>(
        "SELECT id, title, thumbnail_image_id, post_date, last_update_date FROM blog_posts WHERE id = $1"
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;
    
    Ok(record)
}

// === リポジトリ実装（インフラ層） ===
// src/infrastructure/repositories/sqlx_blog_post_repository.rs
use anyhow::{Result, Context, bail};
use crate::domain::errors::DomainError;

impl BlogPostRepository for SqlxBlogPostRepository {
    async fn find_by_id(&self, id: BlogPostId) -> Result<Option<BlogPost>> {
        // 1. データベース層を呼び出し、SQLxエラーをanyhowエラーに変換
        let record = fetch_blog_post_by_id(&self.pool, id.value())
            .await
            .with_context(|| format!("データベースからブログ記事の取得に失敗: {}", id))?;
        
        // 2. レコードが存在しない場合は None を返す（エラーではない）
        match record {
            Some(r) => {
                // 3. レコード → ドメインエンティティ変換でエラーが発生する可能性
                let entity = self.record_to_entity(r)
                    .with_context(|| format!("ブログ記事エンティティの変換に失敗: {}", id))?;
                Ok(Some(entity))
            }
            None => Ok(None),
        }
    }
    
    async fn save(&self, blog_post: &BlogPost) -> Result<()> {
        // ドメインエンティティからレコードに変換
        let record = self.entity_to_record(blog_post)
            .with_context(|| "ブログ記事レコードの変換に失敗")?;
        
        // データベース保存処理
        save_blog_post_record(&self.pool, &record)
            .await
            .with_context(|| format!("ブログ記事の保存に失敗: {}", blog_post.id()))?;
            
        Ok(())
    }
    
    // レコード → エンティティ変換（DomainErrorが発生する可能性）
    fn record_to_entity(&self, record: BlogPostRecord) -> Result<BlogPost> {
        // タイトルの検証
        if record.title.trim().is_empty() {
            bail!(DomainError::InvalidTitle("タイトルが空です".to_string()));
        }
        
        // エンティティ構築
        let blog_post = BlogPost::new(
            BlogPostId::new(record.id),
            Title::new(record.title)?,
        )
        .with_context(|| "ブログ記事エンティティの構築に失敗")?;
        
        Ok(blog_post)
    }
}

// === ユースケース層（アプリケーション層） ===
// src/application/use_cases/get_blog_post.rs
impl GetBlogPostUseCase {
    pub async fn execute(&self, id: BlogPostId) -> Result<BlogPost> {
        // 1. リポジトリからエンティティを取得
        let blog_post = self.blog_post_repo
            .find_by_id(id)
            .await
            .with_context(|| format!("ブログ記事取得処理でエラー: {}", id))?;
            
        // 2. 存在しない場合は明示的にDomainErrorを発生
        match blog_post {
            Some(post) => Ok(post),
            None => bail!(DomainError::BlogPostNotFound(id)),
        }
    }
}
```

##### 5. ログ戦略

```rust
// src/infrastructure/web/handlers/blog_post_handler.rs
use anyhow::{Result, Context};
use crate::infrastructure::web::error_mapping::AppError;

impl BlogPostHandler {
    pub async fn get_blog_post(&self, path: web::Path<String>) -> Result<impl Responder, AppError> {
        let id = BlogPostId::from_str(&path)
            .with_context(|| format!("無効なブログ記事ID形式: {}", path.as_str()))?;

        match self.get_blog_post_use_case.execute(id).await {
            Ok(blog_post) => {
                log::info!("ブログ記事を正常に取得しました: {}", id);
                let response = BlogPostResponse::from(blog_post);
                Ok(HttpResponse::Ok().json(response))
            }
            Err(e) => {
                // エラーチェーンを含む詳細なログ出力
                log::error!("ブログ記事取得に失敗しました {}: {:?}", id, e);
                
                // エラーの詳細な因果関係をログに記録
                let mut source = e.source();
                while let Some(err) = source {
                    log::error!("  原因: {}", err);
                    source = err.source();
                }
                
                Err(AppError::from(e))
            }
        }
    }
}
```

##### 6. 設計原則

1. **失敗の明確化**: `anyhow::Context`を使用してエラーの原因と対処法が明確に分かるメッセージを提供
2. **セキュリティ考慮**: プロダクション環境では内部実装詳細を隠蔽し、適切なエラーコードのみを返却
3. **ログの構造化**: エラーチェーンを辿ってデバッグを容易にする詳細なログ出力
4. **型安全性**: `anyhow::Result`を使用してコンパイル時にエラーハンドリングの漏れを検出
5. **一貫性**: `AppError`ラッパーによってアプリケーション全体で統一されたエラーレスポンス形式を実現
6. **コンテキスト保持**: `with_context()`によってエラー発生箇所と処理内容を明確に記録

##### 7. anyhowクレートの利点

- **簡潔性**: `Result<T>`のシンプルな記述でエラーハンドリングが可能
- **エラーチェーン**: エラーの因果関係を追跡可能
- **柔軟性**: 任意のエラー型を`anyhow::Error`に変換可能
- **デバッグ支援**: エラーの詳細な情報とバックトレースを提供
- **メンテナンス性**: エラー処理コードの可読性と保守性が向上

この戦略により、各層の責務に応じた適切なエラーハンドリングを実現し、保守性とデバッグ効率を向上させます。

#### 依存性注入（DI）戦略

##### 1. DIコンテナの設計

```rust
// src/infrastructure/di/container.rs
use std::sync::Arc;
use sqlx::PgPool;
use crate::{
    domain::repositories::BlogPostRepository,
    application::use_cases::{GetBlogPostUseCase, CreateBlogPostUseCase},
    infrastructure::repositories::SqlxBlogPostRepository,
};

pub struct Container {
    // リポジトリ
    blog_post_repo: Arc<dyn BlogPostRepository>,
    
    // ユースケース
    get_blog_post_use_case: GetBlogPostUseCase,
    create_blog_post_use_case: CreateBlogPostUseCase,
}

impl Container {
    pub fn new(pool: PgPool) -> Self {
        // 1. リポジトリの構築
        let blog_post_repo = Arc::new(SqlxBlogPostRepository::new(pool.clone()));
        
        // 2. ユースケースの構築（依存性注入）
        let get_blog_post_use_case = GetBlogPostUseCase::new(blog_post_repo.clone());
        let create_blog_post_use_case = CreateBlogPostUseCase::new(blog_post_repo.clone());
        
        Self {
            blog_post_repo,
            get_blog_post_use_case,
            create_blog_post_use_case,
        }
    }
    
    // ユースケースの取得メソッド
    pub fn get_blog_post_use_case(&self) -> &GetBlogPostUseCase {
        &self.get_blog_post_use_case
    }
    
    pub fn create_blog_post_use_case(&self) -> &CreateBlogPostUseCase {
        &self.create_blog_post_use_case
    }
}
```

##### 2. 各層での依存性管理

```rust
// === ドメイン層（トレイト定義） ===
// src/domain/repositories/blog_post_repository.rs
#[async_trait]
pub trait BlogPostRepository: Send + Sync {
    async fn find_by_id(&self, id: BlogPostId) -> Result<Option<BlogPost>>;
    async fn save(&self, blog_post: &BlogPost) -> Result<()>;
    async fn find_latest(&self, limit: Option<usize>) -> Result<Vec<BlogPost>>;
}

// === アプリケーション層（依存性受け取り） ===
// src/application/use_cases/get_blog_post.rs
pub struct GetBlogPostUseCase {
    blog_post_repo: Arc<dyn BlogPostRepository>,
}

impl GetBlogPostUseCase {
    pub fn new(blog_post_repo: Arc<dyn BlogPostRepository>) -> Self {
        Self { blog_post_repo }
    }
    
    pub async fn execute(&self, id: BlogPostId) -> Result<BlogPost> {
        let blog_post = self.blog_post_repo
            .find_by_id(id)
            .await
            .with_context(|| format!("ブログ記事取得処理でエラー: {}", id))?;
            
        match blog_post {
            Some(post) => Ok(post),
            None => bail!(DomainError::BlogPostNotFound(id)),
        }
    }
}

// === インフラ層（具象実装） ===
// src/infrastructure/repositories/sqlx_blog_post_repository.rs
pub struct SqlxBlogPostRepository {
    pool: PgPool,
}

impl SqlxBlogPostRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl BlogPostRepository for SqlxBlogPostRepository {
    async fn find_by_id(&self, id: BlogPostId) -> Result<Option<BlogPost>> {
        // 実装...
    }
}
```

##### 3. Webハンドラーでの使用

```rust
// src/infrastructure/web/handlers/blog_post_handler.rs
use actix_web::{web, HttpResponse, Responder};
use crate::infrastructure::di::Container;

// ハンドラー関数（構造体ではなく関数ベース）
pub async fn get_blog_post(
    path: web::Path<String>,
    container: web::Data<Container>,
) -> Result<impl Responder, AppError> {
    let id = BlogPostId::from_str(&path)
        .with_context(|| format!("無効なブログ記事ID形式: {}", path.as_str()))?;

    // web::Dataからユースケースを取得
    let blog_post = container
        .get_blog_post_use_case()
        .execute(id)
        .await?;

    let response = BlogPostResponse::from(blog_post);
    Ok(HttpResponse::Ok().json(response))
}

pub async fn create_blog_post(
    blog_post_req: web::Json<BlogPostRequest>,
    container: web::Data<Container>,
) -> Result<impl Responder, AppError> {
    let blog_post = BlogPost::try_from(blog_post_req.into_inner())
        .with_context(|| "リクエストデータの変換に失敗")?;

    let created_post = container
        .create_blog_post_use_case()
        .execute(blog_post)
        .await?;

    let response = BlogPostResponse::from(created_post);
    Ok(HttpResponse::Created().json(response))
}
```

##### 4. アプリケーション起動時の設定

```rust
// src/main.rs
use actix_web::{web, App, HttpServer};
use sqlx::PgPool;
use crate::infrastructure::{
    di::Container,
    web::handlers::blog_post_handler::{get_blog_post, create_blog_post},
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // データベース接続プール作成
    let pool = PgPool::connect(&database_url).await.expect("Failed to connect to database");
    
    // DIコンテナ作成
    let container = Container::new(pool);
    
    HttpServer::new(move || {
        App::new()
            // DIコンテナをweb::Dataとして登録
            .app_data(web::Data::new(container.clone()))
            .service(
                web::scope("/blog")
                    .route("/posts/{id}", web::get().to(get_blog_post))
                    .route("/posts", web::post().to(create_blog_post))
            )
            .service(
                web::scope("/admin/blog")
                    .route("/posts", web::post().to(create_blog_post))
                    .route("/posts/{id}", web::get().to(get_blog_post))
            )
    })
    .bind("127.0.0.1:8001")?
    .run()
    .await
}

// === ルーティング設定の分離 ===
// src/infrastructure/web/routes.rs
use actix_web::{web, Scope};
use crate::infrastructure::web::handlers::blog_post_handler;

pub fn blog_routes() -> Scope {
    web::scope("/blog")
        .route("/posts/latest", web::get().to(blog_post_handler::get_latest_posts))
        .route("/posts/{id}", web::get().to(blog_post_handler::get_blog_post))
        .route("/posts/top-tech-pick", web::get().to(blog_post_handler::get_top_tech_pick))
        .route("/posts/pickup", web::get().to(blog_post_handler::get_pickup_posts))
        .route("/posts/popular", web::get().to(blog_post_handler::get_popular_posts))
}

pub fn admin_routes() -> Scope {
    web::scope("/admin/blog")
        .route("/posts", web::post().to(blog_post_handler::create_blog_post))
        .route("/posts/{id}", web::get().to(blog_post_handler::get_blog_post))
        .route("/posts/top-tech-pick", web::put().to(blog_post_handler::update_top_tech_pick))
        .route("/posts/pickup", web::put().to(blog_post_handler::update_pickup_posts))
        .route("/posts/popular", web::put().to(blog_post_handler::update_popular_posts))
}
```

##### 5. テスト戦略

```rust
// === モックリポジトリ ===
// src/infrastructure/repositories/mock_blog_post_repository.rs
pub struct MockBlogPostRepository {
    posts: Arc<Mutex<HashMap<BlogPostId, BlogPost>>>,
}

impl MockBlogPostRepository {
    pub fn new() -> Self {
        Self {
            posts: Arc::new(Mutex::new(HashMap::new())),
        }
    }
    
    pub fn add_post(&self, post: BlogPost) {
        let mut posts = self.posts.lock().unwrap();
        posts.insert(post.id(), post);
    }
}

#[async_trait]
impl BlogPostRepository for MockBlogPostRepository {
    async fn find_by_id(&self, id: BlogPostId) -> Result<Option<BlogPost>> {
        let posts = self.posts.lock().unwrap();
        Ok(posts.get(&id).cloned())
    }
    
    async fn save(&self, blog_post: &BlogPost) -> Result<()> {
        let mut posts = self.posts.lock().unwrap();
        posts.insert(blog_post.id(), blog_post.clone());
        Ok(())
    }
}

// === テスト用DIコンテナ ===
// tests/common/test_container.rs
pub struct TestContainer {
    blog_post_repo: Arc<MockBlogPostRepository>,
    get_blog_post_use_case: GetBlogPostUseCase,
}

impl TestContainer {
    pub fn new() -> Self {
        let blog_post_repo = Arc::new(MockBlogPostRepository::new());
        let get_blog_post_use_case = GetBlogPostUseCase::new(blog_post_repo.clone());
        
        Self {
            blog_post_repo,
            get_blog_post_use_case,
        }
    }
    
    pub fn blog_post_repo(&self) -> &MockBlogPostRepository {
        &self.blog_post_repo
    }
    
    pub fn get_blog_post_use_case(&self) -> &GetBlogPostUseCase {
        &self.get_blog_post_use_case
    }
}

// === 単体テスト例 ===
#[tokio::test]
async fn test_get_blog_post_success() {
    // Arrange
    let container = TestContainer::new();
    let blog_post = BlogPost::new(
        BlogPostId::new(Uuid::new_v4()),
        Title::new("Test Title".to_string()).unwrap(),
    ).unwrap();
    
    container.blog_post_repo().add_post(blog_post.clone());
    
    // Act
    let result = container
        .get_blog_post_use_case()
        .execute(blog_post.id())
        .await;
    
    // Assert
    assert!(result.is_ok());
    let retrieved_post = result.unwrap();
    assert_eq!(retrieved_post.id(), blog_post.id());
}
```

##### 6. web::Dataを使用する利点

1. **Actix-web標準**: フレームワークの慣例に従った実装
2. **簡潔性**: ハンドラー関数の記述が簡潔で読みやすい
3. **自動的な参照カウント**: `web::Data`内部で`Arc`を使用
4. **型安全性**: コンパイル時に依存関係の整合性を検証
5. **テスト容易性**: ハンドラー関数を直接テスト可能

##### 7. ライフタイム管理のベストプラクティス

1. **共有所有権**: `Arc<dyn Trait>`でマルチスレッド環境での安全な共有
2. **循環参照回避**: 親→子の方向のみで依存関係を構築
3. **リソース管理**: データベース接続プールの適切なクローン使用
4. **テストでの分離**: テスト用の独立したDIコンテナを使用
5. **web::Data活用**: Actix-webの仕組みを活用した効率的な共有

##### 8. 設計原則

1. **単一責任**: 各コンポーネントは単一の責任を持つ
2. **依存性逆転**: 上位層が下位層の詳細に依存しない
3. **テスタビリティ**: モックを容易に注入できる設計
4. **型安全性**: コンパイル時に依存関係の整合性を検証
5. **パフォーマンス**: 不要なコピーやクローンを避ける効率的な設計
6. **フレームワーク準拠**: Actix-webの慣例とベストプラクティスに従う

この戦略により、テストしやすく保守性の高い依存性管理を実現し、各層の疎結合とビジネスロジックの純粋性を保持できます。また、`web::Data`を活用することで、Actix-webの標準的なパターンに従い、より読みやすく保守しやすいコードを実現できます。

## v2 API 開発戦略

アーキテクチャ再設計では、既存 v1 API を維持しながら新規 v2 API を並行開発します。

### v2 API 設計方針

#### 1. 別コンテナ戦略

- **`source/backend_v2/api_v2/`** - v1 をコピーして新アーキテクチャで再実装
- **Kubernetes ingress** - パスベースルーティングで`/api/v2/*`を v2 コンテナに転送
- **段階的移行** - v2 完成後、v1 削除して v2 を統合

#### 2. 技術スタック

- **OpenAPI 3.0** - `utoipa`クレートで Rust コードから自動生成
- **ドメインモデル** - `source/backend_v2/domain/`にビジネスロジック集約
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


## フロントエンド再設計方針

バックエンドのドメインロジック集約に伴い、フロントエンドを軽量化し、プレゼンテーション層に特化したアーキテクチャに再設計します。

### 現在のフロントエンド問題点

#### 1. 複雑な4層構造による問題

```
現在の構造:
source/frontend/packages/
├── entities/          # ドメインエンティティ（問題の根源）
├── service/           # ビジネスロジック
├── shared-interface-adapter/  # API通信・型定義
└── usecases/          # アプリケーションロジック（各アプリで個別実装）
```

**主要問題**:
- **責務の重複**: フロントエンドとバックエンドでドメインロジックが重複
- **データ変換の多重化**: 6回のデータ変換によるパフォーマンス劣化
- **保守コストの増大**: 同じビジネスルールを2箇所で管理
- **型安全性の複雑化**: エンティティ⇔DTO変換の型エラーリスク

#### 2. データフロー問題の詳細

```typescript
// 現在の問題のあるフロー
1. API Response (JSON) 
   ↓ スキーマ検証
2. BlogPostDTO 
   ↓ entityService.toDomain()
3. BlogPost Entity (ビジネスロジック実行)
   ↓ entityService.toDTO() 
4. BlogPostDTO
   ↓ API送信時
5. JSON
   ↓ 追加変換
6. さらなる中間型...
```

### フロントエンド軽量化戦略

#### 1. プレゼンテーション層特化アーキテクチャ

バックエンドのドメインロジック集約により、フロントエンドは以下に特化：

- **プレゼンテーション**: UI状態管理・レンダリング・ユーザーインタラクション
- **通信**: API呼び出し・エラーハンドリング・ローディング状態
- **バリデーション**: フォーム入力チェック（UIレベルのみ）
- **ルーティング**: ページ遷移・認証ガード
- **状態管理**: グローバル状態・キャッシュ管理

#### 2. ViewModelパターンの採用

ドメインエンティティを削除し、ViewModelパターンで軽量化：

```typescript
// 新しい軽量化されたViewModel
interface BlogPostViewModel {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  summary: string;
  publishedAt: string;
  updatedAt: string;
  
  // UI状態（プレゼンテーション層専用）
  isLoading?: boolean;
  isSelected?: boolean;
  displayMode?: 'card' | 'list' | 'detail';
}

// APIレスポンス → ViewModel直接変換
function toViewModel(apiResponse: BlogPostResponse): BlogPostViewModel {
  return {
    id: apiResponse.id,
    title: apiResponse.title,
    slug: apiResponse.slug,
    thumbnailUrl: apiResponse.thumbnail.url,
    summary: apiResponse.summary,
    publishedAt: formatDate(apiResponse.dates.post_date),
    updatedAt: formatDate(apiResponse.dates.last_update_date),
  };
}
```

#### 3. 新しいフロントエンドアーキテクチャ（Bulletproof React準拠）

```
軽量化後の構造:
source/frontend/packages/
└── shared-lib/            # 共用ライブラリパッケージ
    ├── api/              # API通信・キャッシュ管理
    ├── types/            # 生成された型定義・ViewModel定義  
    ├── utils/            # ユーティリティ関数
    └── components/       # 再利用可能UIコンポーネント
```

各アプリケーション（Bulletproof React準拠）:
```
├── web/
│   ├── lib/              # アプリ固有のライブラリディレクトリ
│   ├── components/       # アプリ固有のコンポーネント
│   ├── hooks/           # カスタムフック（API呼び出し + ViewModel変換）
│   └── pages/           # ページコンポーネント
└── blog-admin/
    ├── lib/             # 管理画面固有のライブラリディレクトリ
    ├── components/      # 管理画面固有のコンポーネント
    ├── hooks/          # 管理画面用カスタムフック
    └── pages/          # 管理画面ページ
```

### レイヤー再編成計画（完全削除戦略）

#### 1. entities, service, usecases, shared-interface-adapter パッケージの完全削除

**削除対象パッケージ**:
```
source/frontend/packages/
├── entities/              # → 完全削除（バックエンドに移行）
├── service/               # → 完全削除（ビジネスロジックはバックエンドへ）
├── shared-interface-adapter/  # → 完全削除（shared-libパッケージに統合）
└── [各アプリのusecases/]     # → 完全削除（カスタムフックに置換）
```

#### 2. shared-lib パッケージへの統合（Bulletproof React準拠）

```typescript
// shared-lib/api/base.ts - 汎用fetch処理
export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },  │   ├── utils/            # 軽量な変換関数・ユーティリティ
};

// shared-lib/api/blog-posts.ts - 特化したAPI関数
export const blogPostApi = {
  getById: (id: string) => 
    apiClient.get<components['schemas']['BlogPost']>(`/api/v2/blog/posts/${id}`),
  
  getLatest: () =>
    apiClient.get<components['schemas']['BlogPostList']>('/api/v2/blog/posts/latest'),
    
  create: (data: components['schemas']['CreateBlogPostRequest']) =>
    apiClient.post<components['schemas']['BlogPost']>('/api/v2/admin/blog/posts', data),
};

// shared-lib/types/view-models.ts - ViewModel定義
export interface BlogPostViewModel {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  summary: string;
  publishedAt: string;
  updatedAt: string;
  isLoading?: boolean;
  isSelected?: boolean;
}

// shared-lib/utils/transformers.ts - 軽量な変換関数
export const transformers = {
  toBlogPostViewModel: (response: components['schemas']['BlogPost']): BlogPostViewModel => ({
    id: response.id,
    title: response.title,
    slug: response.slug,
    thumbnailUrl: response.thumbnail.url,
    summary: response.summary,
    publishedAt: formatDate(response.dates.post_date),
    updatedAt: formatDate(response.dates.last_update_date),
  }),
};
```

#### 3. アプリケーション層でのカスタムフック実装

```typescript
// web/hooks/use-blog-post.ts - 各アプリでの実装
export const useBlogPost = (id: string) => {
  const [viewModel, setViewModel] = useState<BlogPostViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    blogPostApi.getById(id)
      .then(response => setViewModel(transformers.toBlogPostViewModel(response)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);
  
  return { viewModel, loading, error };
};

// blog-admin/hooks/use-blog-post-form.ts - 管理画面専用
export const useBlogPostForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createBlogPost = async (formData: BlogPostFormData) => {
    setIsSubmitting(true);
    try {
      const request = transformers.toCreateRequest(formData);
      const response = await blogPostApi.create(request);
      return transformers.toBlogPostViewModel(response);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { createBlogPost, isSubmitting };
};
```

### データフロー最適化

#### 新しいデータフロー

```
軽量化後のフロー（2回変換）:
1. API Response (生成された型)
   ↓ toViewModel()
2. ViewModel (表示用)
   ↓ コンポーネントレンダリング
3. UI表示
```

**改善点**:
- **変換回数**: 6回 → 2回（66%削減）
- **型安全性**: 生成された型によるコンパイル時保証
- **保守性**: 単一責任原則によるシンプルな構造
- **パフォーマンス**: 不要な中間オブジェクト生成の排除

### 実装アプローチ

#### shared-lib パッケージ基盤構築

1. **shared-lib パッケージ作成**
   - `source/frontend/packages/shared-lib/` パッケージを作成
   - Bulletproof React の構造に従った汎用ライブラリとして設計

2. **OpenAPI型生成の shared-lib への移行**
   - `make generate-types` の出力先を `shared-lib/types/generated.ts` に変更
   - ViewModel定義を `shared-lib/types/view-models.ts` に作成

3. **汎用API クライアント実装**
   - `shared-lib/api/base.ts` で汎用fetch処理を実装
   - エラーハンドリング・ローディング状態の統一

#### パッケージ完全削除とリファクタリング

1. **entities, service, usecases, shared-interface-adapter パッケージの完全削除**
   - ビジネスロジック → バックエンド移行
   - Repository パターン → shared-lib API関数に統合
   - UseCase クラス → カスタムフックに置換
   - 複雑な変換ロジック → 軽量なtransformer関数に簡素化

2. **アプリケーション層の再構築**
   - カスタムフック実装（API呼び出し + ViewModel変換）
   - コンポーネントのUseCase依存を削除
   - プロップスドリリングの最適化

3. **型安全性とパフォーマンスの最適化**
   - TypeScript コンパイルエラーの解消
   - 不要な依存関係の削除
   - バンドルサイズの最適化

### 期待される効果

#### 1. 開発効率の向上

- **型安全性**: OpenAPI生成型による強力な型チェック
- **学習コスト削減**: シンプルなアーキテクチャによる理解しやすさ
- **開発速度向上**: 中間変換処理の削除による実装の簡素化

#### 2. 保守性の向上

- **責務の明確化**: バックエンド（ビジネスロジック）とフロントエンド（プレゼンテーション）の分離
- **変更影響範囲の限定**: ドメインルール変更時はバックエンドのみ修正
- **テストの簡素化**: ビジネスロジックテストの統一

#### 3. パフォーマンス改善

- **メモリ使用量削減**: 不要な中間オブジェクトの削除
- **レンダリング最適化**: ViewModelによる効率的なReactレンダリング
- **バンドルサイズ削減**: entities/service/usecases/shared-interface-adapter パッケージの完全削除
- **依存関係の簡素化**: lib パッケージによる統一されたAPI

#### 4. アーキテクチャの簡素化

- **パッケージ数削減**: 8パッケージ → 5パッケージ（web/blog-admin/shared-lib/e2e/shared-test-data）
- **学習コスト削減**: Bulletproof React準拠による標準的な構造
- **責務の明確化**: プレゼンテーション（フロント）とビジネスロジック（バックエンド）の完全分離
- **保守性向上**: 単一パッケージ（shared-lib）による共通処理の統一管理

### 最終的なアーキテクチャ概要

```
完全削除後の構造:
source/frontend/packages/
├── shared-lib/            # 共用ライブラリパッケージ（Bulletproof React準拠）
│   ├── api/              # 統一されたAPI通信処理
│   ├── types/            # 生成型 + ViewModel定義
│   ├── utils/            # 軽量な変換関数・ユーティリティ
│   └── components/       # 再利用可能UIコンポーネント
├── web/                   # 公開サイト（API + ViewModel + UI）
│   └── lib/              # アプリ固有のライブラリディレクトリ
├── blog-admin/            # 管理画面（API + ViewModel + UI）
│   └── lib/              # 管理画面固有のライブラリディレクトリ
├── e2e/                   # E2Eテスト（維持）
└── shared-test-data/      # テストデータ（維持）
```

この再設計により、フロントエンドを軽量で保守しやすいプレゼンテーション特化アーキテクチャに転換し、Bulletproof React のベストプラクティスに準拠した現代的な構造を実現します。

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
   - [ ] 現在のBlogPostResponse等の型定義をcommonクレートに移動
   - [ ] api_v2とapi_v2_testで同じ型を共有
   - [ ] 型の互換性テストの作成

2. **3層アーキテクチャのディレクトリ構造作成**
   - [ ] domain/、application/、infrastructure/ディレクトリの作成
   - [ ] 既存コードはそのまま維持（v1コンテナがロールバック先として機能）
   - [ ] 新アーキテクチャのコードを段階的に追加

3. **レスポンスDTOの整理と分離**
   - [ ] 既存のレスポンス形式をそのままDTOとして定義
   - [ ] ハンドラーから直接DTOを返すように一時的に修正
   - [ ] 将来のアダプター層のためのインターフェース準備

#### Phase 2: バックエンド内部再設計

**目的**: APIインターフェースを変えずに、DDDベースの3層アーキテクチャを実装

**実装計画**:
1. **ドメイン層の実装**
   - [ ] BlogPostエンティティ実装（内部表現）
   - [ ] 値オブジェクト実装
   - [ ] リポジトリインターフェース定義
   - [ ] ドメインエラー定義

2. **インフラ層の実装**
   - [ ] SQLxリポジトリ実装
   - [ ] ドメインエンティティ ⇔ DBレコード変換
   - [ ] 既存のデータベーススキーマとの互換性維持

3. **アプリケーション層の実装**
   - [ ] ユースケース実装
   - [ ] DIコンテナによる依存性注入
   - [ ] エラーハンドリング実装

4. **Webハンドラーの移行**
   - [ ] 新アーキテクチャを使用するハンドラー実装
   - [ ] アダプター層でレスポンス形式を保証
   - [ ] エンドポイントごとに段階的切り替え
   - [ ] 各エンドポイント切り替え後のテスト確認

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

**現在作業中**: Phase 1 - バックエンドとフロントエンドの境界再構築

### 進捗追跡

作業の進捗は、各タスク完了時にチェックボックスを更新します。各フェーズの完了時には、全てのテストが通過することを確認してから次のフェーズに進みます。

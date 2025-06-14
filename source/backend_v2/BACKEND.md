# バックエンド開発ガイド

このファイルはバックエンド開発に関する情報を集約しています。

## バックエンド構造

### バックエンド (`source/backend_v2/`)
- **`api_v2/`** - v2 API サービス（Actix-web + OpenAPI + ドメインモデル）
- **`api_v2_test/`** - v2 API 統合テスト
- **`common/`** - 共有型とユーティリティ
- **`domain/`** - ドメインモデルとビジネスロジック（v2 用）
- **データベースマイグレーション:** `api/migrations/schema/`（構造）と `api/migrations/seeds/`（データ）

## バックエンド開発コマンド

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

## コード品質

- **バックエンド:** API コンテナ内で `cargo test` と `cargo fmt` を使用

## 開発時の重要事項

- **データベース:** 型安全なデータベース操作に SQLx を使用。マイグレーションは必ず `make api-migrate-run` で実行

## API 統合テスト実装

- **配置場所:** `source/backend_v2/api_v2_test/src/tests/handlers/[リソース名]/[操作名].rs`
- 例: `source/backend_v2/api_v2_test/src/tests/handlers/blog_posts/get.rs`
- `make api-v2-test-run` でテスト実行し、失敗確認（Red 状態）

## バックエンド API アクセス

- **公開サイト用 API:** `blog.example/api`
- **管理画面用 API:** `admin.blog.example/api`

## バックエンド3層アーキテクチャ再設計

### 設計方針
ドメイン駆動設計（DDD）に基づく3層アーキテクチャを採用し、責務分離とビジネスロジックの集約を実現します。

### 1. エンティティ層（Domain Layer）
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

### 2. ユースケース層（Application Layer）
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

### 3. インフラ層（Infrastructure Layer）
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

### ディレクトリ構造

```
source/backend_v2/
├── common/                  # 共有型定義
│   └── src/types/api/response.rs  # APIレスポンス型（テスト共有・APIインターフェース維持）
├── api_v2/
│   └── src/
│       ├── domain/          # ドメイン層（最内層）
│       │   ├── blog_domain.rs    # ブログ記事関連ドメイン
│       │   ├── image_domain.rs   # 画像管理関連ドメイン
│       │   └── errors.rs         # ドメインエラー
│       ├── application/     # ユースケース層（中間層）
│       │   ├── dto/         # 内部DTO（ドメイン↔アプリケーション間）
│       │   ├── service/     # アプリケーションサービス
│       │   └── use_cases/   # アプリケーションユースケース
│       └── infrastructure/  # インフラ層（最外層）
│           ├── repositories/ # リポジトリ実装
│           ├── web/         # Webインターフェース（common::typesを使用）
│           └── database/    # DBモデル・マイグレーション
└── api_v2_test/            # APIテスト（commonレスポンス型使用）
```

## モジュール構造の規則

### 命名規則

- **エンティティ**: `XxxEntity` （例: `BlogPostEntity`, `ImageEntity`）
- **値オブジェクト**: `XxxVO` （例: `RichTextVO`, `TitleVO`）
- **ドメインファイル**: `xxx_domain.rs` （例: `blog_domain.rs`, `image_domain.rs`）

### モジュールファイルの規則

- **`mod.rs`の使用禁止**: `mod.rs`ファイルは使用せず、`module_name.rs`でモジュールルートを定義する
- **ドメイン分離**: 各ドメインは独立したファイルとして管理し、ドメイン内でエンティティと値オブジェクトを一元管理する

### 例

```rust
// ✅ 正しい例
// src/domain/blog_domain.rs - ブログドメインの全要素を一つのファイルで管理
pub struct BlogPostEntity { /* ... */ }
pub struct RichTextVO { /* ... */ }

// src/domain/image_domain.rs - 画像ドメインの全要素を一つのファイルで管理  
pub struct ImageEntity { /* ... */ }

// ❌ 避けるべき例
// src/domain/blog/mod.rs
// src/domain/blog/entities/blog_post.rs
// src/domain/blog/value_objects/rich_text.rs
```

このアプローチにより、ドメインの境界が明確になり、ファイル管理が簡潔になります。

### データフロー

```
[Database] → Repository Impl → Domain Entity → Use Case → Handler → common::types::response → JSON
```

**変換回数**: 3回（DB→Entity、Entity→common::response、Response→JSON）

**依存関係**:
- Infrastructure層 → common::types（APIインターフェース維持）
- Application層 → Domain層（内部DTO使用）
- Domain層は他層に依存しない（最内層の純粋性保持）

### 主な改善点

1. **責務分離**: 各層の役割が明確に分離
2. **ビジネスルール集約**: ドメインエンティティにビジネスロジック集約
3. **テストしやすさ**: 各層が独立してテスト可能
4. **型安全性**: ドメインオブジェクトでの型安全性確保
5. **保守性**: 変更時の影響範囲が限定的
6. **共有型定義**: commonクレートでAPIテストとの型共有

### エラーハンドリング戦略

#### 1. エラー分類と配置

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

#### 2. 各層でのエラー処理方針

- **ドメイン層**: ビジネスルール違反を明確に表現し、下位層へエラーを依存させない
- **アプリケーション層**: ドメインエラーをそのまま伝播、必要に応じて追加コンテキストを付与
- **インフラ層**: 外部システムエラーを適切にドメインエラーまたはインフラエラーにマッピング

#### 3. HTTPレスポンスマッピング

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

#### 4. エラー伝播パターンと層別責務

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

#### 5. ログ戦略

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

#### 6. 設計原則

1. **失敗の明確化**: `anyhow::Context`を使用してエラーの原因と対処法が明確に分かるメッセージを提供
2. **セキュリティ考慮**: プロダクション環境では内部実装詳細を隠蔽し、適切なエラーコードのみを返却
3. **ログの構造化**: エラーチェーンを辿ってデバッグを容易にする詳細なログ出力
4. **型安全性**: `anyhow::Result`を使用してコンパイル時にエラーハンドリングの漏れを検出
5. **一貫性**: `AppError`ラッパーによってアプリケーション全体で統一されたエラーレスポンス形式を実現
6. **コンテキスト保持**: `with_context()`によってエラー発生箇所と処理内容を明確に記録

#### 7. anyhowクレートの利点

- **簡潔性**: `Result<T>`のシンプルな記述でエラーハンドリングが可能
- **エラーチェーン**: エラーの因果関係を追跡可能
- **柔軟性**: 任意のエラー型を`anyhow::Error`に変換可能
- **デバッグ支援**: エラーの詳細な情報とバックトレースを提供
- **メンテナンス性**: エラー処理コードの可読性と保守性が向上

この戦略により、各層の責務に応じた適切なエラーハンドリングを実現し、保守性とデバッグ効率を向上させます。

### 依存性注入（DI）戦略

#### 1. DIコンテナの設計

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

#### 2. 各層での依存性管理

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

#### 3. Webハンドラーでの使用

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

#### 4. アプリケーション起動時の設定

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

#### 5. テスト戦略

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

#### 6. web::Dataを使用する利点

1. **Actix-web標準**: フレームワークの慣例に従った実装
2. **簡潔性**: ハンドラー関数の記述が簡潔で読みやすい
3. **自動的な参照カウント**: `web::Data`内部で`Arc`を使用
4. **型安全性**: コンパイル時に依存関係の整合性を検証
5. **テスト容易性**: ハンドラー関数を直接テスト可能

#### 7. ライフタイム管理のベストプラクティス

1. **共有所有権**: `Arc<dyn Trait>`でマルチスレッド環境での安全な共有
2. **循環参照回避**: 親→子の方向のみで依存関係を構築
3. **リソース管理**: データベース接続プールの適切なクローン使用
4. **テストでの分離**: テスト用の独立したDIコンテナを使用
5. **web::Data活用**: Actix-webの仕組みを活用した効率的な共有

#### 8. 設計原則

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
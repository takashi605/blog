use anyhow::Result;
use std::sync::Arc;

use crate::{
  application::usecase::{view_blog_post::ViewBlogPostUseCase, view_latest_blog_posts::ViewLatestBlogPostsUseCase},
  domain::blog_domain::blog_post_repository::BlogPostRepository,
  infrastructure::repositories::blog_post_sqlx_repository::{db_pool::create_db_pool, BlogPostSqlxRepository},
};

/// DIコンテナ
/// アプリケーション全体で使用される依存性を管理する
pub struct DiContainer {
  /// ブログ記事リポジトリ
  blog_post_repository: Arc<dyn BlogPostRepository>,
}

impl DiContainer {
  /// DIコンテナを初期化する
  pub async fn new() -> Result<Self> {
    // データベース接続プールを作成
    let db_pool = Arc::new(create_db_pool().await?);

    // リポジトリを作成
    let blog_post_repository: Arc<dyn BlogPostRepository> = Arc::new(BlogPostSqlxRepository::new((*db_pool).clone()));

    Ok(Self { blog_post_repository })
  }

  /// ViewBlogPostUseCaseを作成する
  pub fn view_blog_post_usecase(&self) -> ViewBlogPostUseCase {
    ViewBlogPostUseCase::new(self.blog_post_repository.clone())
  }

  /// ViewLatestBlogPostsUseCaseを作成する
  pub fn view_latest_blog_posts_usecase(&self) -> ViewLatestBlogPostsUseCase {
    ViewLatestBlogPostsUseCase::new(self.blog_post_repository.clone())
  }
}

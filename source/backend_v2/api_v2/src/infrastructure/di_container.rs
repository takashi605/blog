use anyhow::Result;
use std::sync::Arc;

use crate::{
  application::usecase::{create_blog_post::CreateBlogPostUseCase, view_blog_post::ViewBlogPostUseCase, view_latest_blog_posts::ViewLatestBlogPostsUseCase},
  domain::{blog_domain::blog_post_repository::BlogPostRepository, image_domain::image_repository::ImageRepository},
  infrastructure::repositories::{blog_post_sqlx_repository::BlogPostSqlxRepository, db_pool::create_db_pool, image_sqlx_repository::ImageSqlxRepository},
};

/// DIコンテナ
/// アプリケーション全体で使用される依存性を管理する
pub struct DiContainer {
  /// ブログ記事リポジトリ
  blog_post_repository: Arc<dyn BlogPostRepository>,
  /// 画像リポジトリ
  image_repository: Arc<dyn ImageRepository>,
}

impl DiContainer {
  /// DIコンテナを初期化する
  pub async fn new() -> Result<Self> {
    // データベース接続プールを作成
    let db_pool = Arc::new(create_db_pool().await?);

    // 画像リポジトリを作成
    let image_repository: Arc<dyn ImageRepository> = Arc::new(ImageSqlxRepository::new((*db_pool).clone()));

    // ブログ記事リポジトリを作成（ImageSqlxRepositoryを直接注入）
    let image_sqlx_repository = ImageSqlxRepository::new((*db_pool).clone());
    let blog_post_repository: Arc<dyn BlogPostRepository> = Arc::new(BlogPostSqlxRepository::new((*db_pool).clone(), image_sqlx_repository));

    Ok(Self {
      blog_post_repository,
      image_repository,
    })
  }

  /// ViewBlogPostUseCaseを作成する
  pub fn view_blog_post_usecase(&self) -> ViewBlogPostUseCase {
    ViewBlogPostUseCase::new(self.blog_post_repository.clone())
  }

  /// ViewLatestBlogPostsUseCaseを作成する
  pub fn view_latest_blog_posts_usecase(&self) -> ViewLatestBlogPostsUseCase {
    ViewLatestBlogPostsUseCase::new(self.blog_post_repository.clone())
  }

  /// CreateBlogPostUseCaseを作成する
  pub fn create_blog_post_usecase(&self) -> CreateBlogPostUseCase {
    CreateBlogPostUseCase::new(self.blog_post_repository.clone())
  }
}

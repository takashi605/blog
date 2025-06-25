use anyhow::Result;
use std::sync::Arc;

use crate::{
  application::usecase::{
    create_blog_post::CreateBlogPostUseCase, register_image::RegisterImageUseCase, select_pick_up_posts::SelectPickUpPostsUseCase,
    select_popular_posts::SelectPopularPostsUseCase, select_top_tech_pick_post::SelectTopTechPickPostUseCase, view_blog_post::ViewBlogPostUseCase,
    view_images::ViewImagesUseCase, view_latest_blog_posts::ViewLatestBlogPostsUseCase, view_pick_up_posts::ViewPickUpPostsUseCase,
    view_popular_blog_posts::ViewPopularBlogPostsUseCase, view_top_tech_pick::ViewTopTechPickUseCase,
  },
  domain::{
    blog_domain::{blog_post_factory::BlogPostFactory, blog_post_repository::BlogPostRepository, image_content_factory::ImageContentFactory},
    image_domain::image_repository::ImageRepository,
  },
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
    let image_content_factory = Arc::new(ImageContentFactory::new(self.image_repository.clone()));
    let blog_post_factory = Arc::new(BlogPostFactory::new(image_content_factory));
    CreateBlogPostUseCase::new(self.blog_post_repository.clone(), blog_post_factory)
  }

  /// RegisterImageUseCaseを作成する
  pub fn register_image_usecase(&self) -> RegisterImageUseCase {
    RegisterImageUseCase::new(self.image_repository.clone())
  }

  /// ViewImagesUseCaseを作成する
  pub fn view_images_usecase(&self) -> ViewImagesUseCase {
    ViewImagesUseCase::new(self.image_repository.clone())
  }

  /// ViewPopularBlogPostsUseCaseを作成する
  pub fn view_popular_blog_posts_usecase(&self) -> ViewPopularBlogPostsUseCase {
    ViewPopularBlogPostsUseCase::new(self.blog_post_repository.clone())
  }

  /// SelectPopularPostsUseCaseを作成する
  pub fn select_popular_posts_usecase(&self) -> SelectPopularPostsUseCase {
    SelectPopularPostsUseCase::new(self.blog_post_repository.clone())
  }

  /// ViewPickUpPostsUseCaseを作成する
  pub fn view_pick_up_posts_usecase(&self) -> ViewPickUpPostsUseCase {
    ViewPickUpPostsUseCase::new(self.blog_post_repository.clone())
  }

  /// SelectPickUpPostsUseCaseを作成する
  pub fn select_pick_up_posts_usecase(&self) -> SelectPickUpPostsUseCase {
    SelectPickUpPostsUseCase::new(self.blog_post_repository.clone())
  }

  /// ViewTopTechPickUseCaseを作成する
  pub fn view_top_tech_pick_usecase(&self) -> ViewTopTechPickUseCase {
    ViewTopTechPickUseCase::new(self.blog_post_repository.clone())
  }

  /// SelectTopTechPickPostUseCaseを作成する
  pub fn select_top_tech_pick_post_usecase(&self) -> SelectTopTechPickPostUseCase {
    SelectTopTechPickPostUseCase::new(self.blog_post_repository.clone())
  }
}

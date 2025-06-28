use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper::convert_to_blog_post_dto;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;

pub struct ViewAllBlogPostsUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl ViewAllBlogPostsUseCase {
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  pub async fn execute(&self) -> anyhow::Result<Vec<BlogPostDTO>> {
    // リポジトリから全記事を取得
    let blog_post_entities = self.repository.find_all().await?;

    // エンティティをDTOに変換
    let mut blog_post_dtos = Vec::new();
    for entity in blog_post_entities {
      let dto = convert_to_blog_post_dto(entity);
      blog_post_dtos.push(dto);
    }

    Ok(blog_post_dtos)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
  use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
  use chrono::NaiveDate;
  use mockall::mock;
  use std::sync::Arc;
  use uuid::Uuid;

  mock! {
    BlogPostRepo {}

    #[async_trait::async_trait]
    impl BlogPostRepository for BlogPostRepo {
      async fn find(&self, id: &str) -> anyhow::Result<BlogPostEntity>;
      async fn save(&self, blog_post: &BlogPostEntity) -> anyhow::Result<BlogPostEntity>;
      async fn find_latests(&self, quantity: Option<u32>) -> anyhow::Result<Vec<BlogPostEntity>>;
      async fn find_top_tech_pick(&self) -> anyhow::Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
      async fn update_top_tech_pick_post(&self, top_tech_pick: &crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity) -> anyhow::Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
      async fn find_pick_up_posts(&self) -> anyhow::Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
      async fn update_pick_up_posts(&self, pickup_posts: &crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity) -> anyhow::Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
      async fn find_popular_posts(&self) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
      async fn update_popular_posts(&self, popular_post_set: &crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
      async fn find_all(&self) -> anyhow::Result<Vec<BlogPostEntity>>;
    }
  }

  // ヘルパー関数: テスト用のBlogPostEntityを作成
  fn create_test_blog_post(title: &str, post_date: NaiveDate) -> BlogPostEntity {
    let id = Uuid::new_v4();
    let mut post = BlogPostEntity::new(id, title.to_string());
    post.set_post_date(post_date);

    // テスト用のダミーサムネイル画像を設定
    let thumbnail_id = Uuid::new_v4();
    post.set_thumbnail(thumbnail_id, "test-thumbnail.jpg".to_string());

    post
  }

  #[tokio::test]
  async fn test_execute_returns_all_blog_posts() {
    // Arrange
    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_all().times(1).returning(move || {
      let old_date = NaiveDate::from_ymd_opt(2024, 1, 10).unwrap();
      let new_date = NaiveDate::from_ymd_opt(2024, 1, 20).unwrap();
      Ok(vec![create_test_blog_post("新しい記事", new_date), create_test_blog_post("古い記事", old_date)])
    });

    let usecase = ViewAllBlogPostsUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute().await;

    // Assert
    assert!(result.is_ok());
    let dtos = result.unwrap();
    assert_eq!(dtos.len(), 2);
    assert_eq!(dtos[0].title, "新しい記事");
    assert_eq!(dtos[1].title, "古い記事");
  }

  #[tokio::test]
  async fn test_execute_handles_empty_list() {
    // Arrange
    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_all().times(1).returning(|| Ok(vec![]));

    let usecase = ViewAllBlogPostsUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute().await;

    // Assert
    assert!(result.is_ok());
    let dtos = result.unwrap();
    assert_eq!(dtos.len(), 0);
  }

  #[tokio::test]
  async fn test_execute_propagates_repository_error() {
    // Arrange
    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_all().times(1).returning(|| Err(anyhow::anyhow!("データベースエラー")));

    let usecase = ViewAllBlogPostsUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute().await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("データベースエラー"));
  }
}

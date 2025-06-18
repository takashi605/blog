use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;

pub struct ViewBlogPostUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl ViewBlogPostUseCase {
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  pub async fn execute(&self, id: &str) -> anyhow::Result<BlogPostDTO> {
    // リポジトリから記事を取得
    let blog_post = self.repository.find(id).await?;

    // BlogPostEntityからViewBlogPostDTOに変換
    let dto = dto_mapper::convert_to_blog_post_dto(blog_post);

    Ok(dto)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
  use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
  use anyhow::Result;
  use async_trait::async_trait;
  use std::sync::Arc;
  use uuid::Uuid;

  // モックリポジトリ
  struct MockBlogPostRepository {
    expected_id: Uuid,
    expected_title: String,
  }

  impl MockBlogPostRepository {
    fn new_with_post_data(id: Uuid, title: String) -> Self {
      Self {
        expected_id: id,
        expected_title: title,
      }
    }
  }

  #[async_trait]
  impl BlogPostRepository for MockBlogPostRepository {
    async fn find(&self, _id: &str) -> Result<BlogPostEntity> {
      let post = BlogPostEntity::new(self.expected_id, self.expected_title.clone());
      Ok(post)
    }

    async fn save(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn find_latests(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn find_top_tech_pick(&self) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn reselect_top_tech_pick_post(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn find_pick_up_posts(&self, _quantity: u32) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn reselect_pick_up_posts(&self, _pickup_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn find_popular_posts(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn reselect_popular_posts(&self, _popular_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }
  }

  #[tokio::test]
  async fn test_記事閲覧用データをリポジトリから取得する() {
    // Arrange
    let test_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let _expected_post = BlogPostEntity::new(test_id, "テストタイトル".to_string());

    let mock_repository = Arc::new(MockBlogPostRepository::new_with_post_data(test_id, "テストタイトル".to_string()));
    let usecase = ViewBlogPostUseCase::new(mock_repository);

    // Act
    let result = usecase.execute("test-id").await;

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.title, "テストタイトル");
  }
}

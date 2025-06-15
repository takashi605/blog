use std::sync::Arc;

use crate::application::dto::{ViewBlogPostDTO, ViewBlogPostContentDTO};
use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;

pub struct ViewBlogPostUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl ViewBlogPostUseCase {
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  pub async fn execute(&self, id: &str) -> anyhow::Result<ViewBlogPostDTO> {
    // リポジトリから記事を取得
    let blog_post = self.repository.find(id).await?;
    
    // BlogPostEntityからViewBlogPostDTOに変換
    let dto = self.convert_to_dto(blog_post);
    
    Ok(dto)
  }

  fn convert_to_dto(&self, blog_post: BlogPostEntity) -> ViewBlogPostDTO {
    ViewBlogPostDTO {
      id: blog_post.get_id().to_string(),
      title: blog_post.get_title_text().to_string(),
      content: ViewBlogPostContentDTO {
        paragraphs: vec![], // TODO: コンテンツ変換は将来実装
      },
      published_date: chrono::Utc::now(), // TODO: 実際の投稿日時を使用
      is_public: true, // TODO: 実際の公開状態を使用
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
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
    // DTOの詳細な検証は実装後に追加
  }
}

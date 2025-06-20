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
    }
  }

  #[tokio::test]
  async fn test_記事閲覧用データをリポジトリから取得する() {
    // Arrange
    let test_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let _expected_post = BlogPostEntity::new(test_id, "テストタイトル".to_string());

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository
      .expect_find()
      .with(mockall::predicate::eq("test-id"))
      .times(1)
      .returning(move |_| Ok(BlogPostEntity::new(test_id, "テストタイトル".to_string())));

    let usecase = ViewBlogPostUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute("test-id").await;

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.title, "テストタイトル");
  }
}

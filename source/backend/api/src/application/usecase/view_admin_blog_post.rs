use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;

pub struct ViewAdminBlogPostUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl ViewAdminBlogPostUseCase {
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  pub async fn execute(&self, id: &str) -> anyhow::Result<BlogPostDTO> {
    // リポジトリから記事を取得
    let blog_post = self.repository.find(id).await?;

    // 管理者用なので公開状態のチェックはスキップ
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
  use crate::domain::blog_domain::jst_date_vo::JstDate;
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
      async fn update(&self, blog_post: &BlogPostEntity) -> anyhow::Result<BlogPostEntity>;
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

  #[tokio::test]
  async fn test_retrieves_published_blog_post_data_from_repository() {
    // Arrange
    let test_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let mut expected_post = BlogPostEntity::new(test_id, "公開済みテストタイトル".to_string());

    // 過去の日付で公開日を設定（公開済み状態）
    let past_date = NaiveDate::from_ymd_opt(2024, 1, 1).unwrap();
    expected_post.set_published_date(JstDate::from_jst_naive_date(past_date));

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find().with(mockall::predicate::eq("published-post-id")).times(1).returning(move |_| {
      let mut post = BlogPostEntity::new(test_id, "公開済みテストタイトル".to_string());
      post.set_published_date(JstDate::from_jst_naive_date(NaiveDate::from_ymd_opt(2024, 1, 1).unwrap()));
      Ok(post)
    });

    let usecase = ViewAdminBlogPostUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute("published-post-id").await;

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.title, "公開済みテストタイトル");
  }

  #[tokio::test]
  async fn test_retrieves_unpublished_blog_post_data_from_repository() {
    // Arrange
    let test_id = Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap();
    let mut unpublished_post = BlogPostEntity::new(test_id, "未公開テストタイトル".to_string());

    // 未来の日付で公開日を設定（未公開状態）
    let future_date = NaiveDate::from_ymd_opt(3000, 12, 31).unwrap();
    unpublished_post.set_published_date(JstDate::from_jst_naive_date(future_date));

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find().with(mockall::predicate::eq("unpublished-post-id")).times(1).returning(move |_| {
      let mut post = BlogPostEntity::new(test_id, "未公開テストタイトル".to_string());
      post.set_published_date(JstDate::from_jst_naive_date(NaiveDate::from_ymd_opt(3000, 12, 31).unwrap()));
      Ok(post)
    });

    let usecase = ViewAdminBlogPostUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute("unpublished-post-id").await;

    // Assert
    // 管理者用なので未公開記事も取得できる
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.title, "未公開テストタイトル");
  }

  #[tokio::test]
  async fn test_returns_error_when_post_not_found() {
    // Arrange
    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find().with(mockall::predicate::eq("non-existent-id")).times(1).returning(|_| Err(anyhow::anyhow!("記事が見つかりません")));

    let usecase = ViewAdminBlogPostUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute("non-existent-id").await;

    // Assert
    assert!(result.is_err());
    let error_message = result.unwrap_err().to_string();
    assert!(error_message.contains("記事が見つかりません"));
  }
}

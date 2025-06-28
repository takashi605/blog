use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper;
use crate::application::services::popular_post_selector_service::PopularPostSelectorService;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;

/// 人気記事選択ユースケース
///
/// 指定された記事IDを人気記事として選択し、更新する
pub struct SelectPopularPostsUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl SelectPopularPostsUseCase {
  /// 新しいユースケースインスタンスを作成する
  ///
  /// # Arguments
  /// * `repository` - ブログ記事リポジトリ
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  /// 人気記事を選択・更新する
  ///
  /// # Arguments
  /// * `post_ids` - 人気記事に設定する記事IDのリスト（3件必須）
  ///
  /// # Returns
  /// * `Ok(Vec<BlogPostDTO>)` - 更新後の人気記事3件のDTOリスト
  /// * `Err` - 記事IDが3件でない場合、記事が見つからない場合、更新に失敗した場合
  pub async fn execute(&self, post_ids: Vec<String>) -> anyhow::Result<Vec<BlogPostDTO>> {
    // PopularPostSelectorServiceを使用して人気記事の選択と更新を行う
    let service = PopularPostSelectorService::new(self.repository.clone());
    let updated_popular_post_set = service.select_popular_posts(post_ids).await?;

    // PopularPostSetEntity -> Vec<BlogPostDTO>に変換
    let posts = updated_popular_post_set.into_all_posts();
    let dtos = posts
      .into_iter()
      .map(|post| {
        // 元のBlogPostEntityをそのまま使用（move semantics）
        dto_mapper::convert_to_blog_post_dto(post)
      })
      .collect();

    Ok(dtos)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
  use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
  use crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity;
  use crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity;
  use anyhow::Result;
  use async_trait::async_trait;
  use mockall::{mock, predicate::eq};
  use std::sync::Arc;
  use uuid::Uuid;

  // mockallによるモックリポジトリ
  mock! {
    BlogPostRepo {}

    #[async_trait]
    impl BlogPostRepository for BlogPostRepo {
      async fn find(&self, id: &str) -> Result<BlogPostEntity>;
      async fn save(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity>;
      async fn find_latests(&self, quantity: Option<u32>) -> Result<Vec<BlogPostEntity>>;
      async fn find_top_tech_pick(&self) -> Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
      async fn update_top_tech_pick_post(&self, top_tech_pick: &crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity) -> Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
      async fn find_pick_up_posts(&self) -> Result<PickUpPostSetEntity>;
      async fn update_pick_up_posts(&self, pickup_posts: &PickUpPostSetEntity) -> Result<PickUpPostSetEntity>;
      async fn find_popular_posts(&self) -> Result<PopularPostSetEntity>;
      async fn update_popular_posts(&self, popular_post_set: &PopularPostSetEntity) -> Result<PopularPostSetEntity>;
    }
  }

  #[tokio::test]
  async fn test_can_select_and_update_three_articles_as_popular_posts() {
    // Arrange
    let post1_id = "00000000-0000-0000-0000-000000000001";
    let post2_id = "00000000-0000-0000-0000-000000000002";
    let post3_id = "00000000-0000-0000-0000-000000000003";

    let mut mock_repo = MockBlogPostRepo::new();

    // findメソッドの期待値設定
    mock_repo.expect_find().with(eq(post1_id)).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "人気記事1".to_string()))
    });
    mock_repo.expect_find().with(eq(post2_id)).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "人気記事2".to_string()))
    });
    mock_repo.expect_find().with(eq(post3_id)).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "人気記事3".to_string()))
    });

    // update_popular_postsメソッドの期待値設定
    mock_repo.expect_update_popular_posts().returning(|popular_post_set| {
      let posts = popular_post_set.get_all_posts();
      let new_posts = [
        BlogPostEntity::new(posts[0].get_id(), posts[0].get_title_text().to_string()),
        BlogPostEntity::new(posts[1].get_id(), posts[1].get_title_text().to_string()),
        BlogPostEntity::new(posts[2].get_id(), posts[2].get_title_text().to_string()),
      ];
      Ok(PopularPostSetEntity::new(new_posts))
    });

    let usecase = SelectPopularPostsUseCase::new(Arc::new(mock_repo));

    // Act
    let result = usecase.execute(vec![post1_id.to_string(), post2_id.to_string(), post3_id.to_string()]).await;

    // Assert
    assert!(result.is_ok());
    let dtos = result.unwrap();
    assert_eq!(dtos.len(), 3);
    assert_eq!(dtos[0].title, "人気記事1");
    assert_eq!(dtos[1].title, "人気記事2");
    assert_eq!(dtos[2].title, "人気記事3");
    assert_eq!(dtos[0].id, post1_id);
    assert_eq!(dtos[1].id, post2_id);
    assert_eq!(dtos[2].id, post3_id);
  }

  #[tokio::test]
  async fn test_returns_error_when_article_ids_are_not_exactly_three() {
    // Arrange
    let mut mock_repo = MockBlogPostRepo::new();

    // findメソッドの期待設定（2件）
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000001")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事1".to_string()))
    });
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000002")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事2".to_string()))
    });

    let usecase = SelectPopularPostsUseCase::new(Arc::new(mock_repo));

    // Act: 2件の場合
    let result = usecase
      .execute(vec![
        "00000000-0000-0000-0000-000000000001".to_string(),
        "00000000-0000-0000-0000-000000000002".to_string(),
      ])
      .await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("人気記事は必ず3件です"));
  }

  #[tokio::test]
  async fn test_returns_error_when_four_article_ids_are_provided() {
    // Arrange
    let mut mock_repo = MockBlogPostRepo::new();

    // findメソッドの期待設定（4件）
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000001")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事1".to_string()))
    });
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000002")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事2".to_string()))
    });
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000003")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事3".to_string()))
    });
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000004")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事4".to_string()))
    });

    let usecase = SelectPopularPostsUseCase::new(Arc::new(mock_repo));

    // Act: 4件の場合
    let result = usecase
      .execute(vec![
        "00000000-0000-0000-0000-000000000001".to_string(),
        "00000000-0000-0000-0000-000000000002".to_string(),
        "00000000-0000-0000-0000-000000000003".to_string(),
        "00000000-0000-0000-0000-000000000004".to_string(),
      ])
      .await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("人気記事は必ず3件です"));
  }

  #[tokio::test]
  async fn test_returns_error_when_non_existent_article_id_is_specified() {
    // Arrange
    let mut mock_repo = MockBlogPostRepo::new();

    // 最初の2件は成功、3件目は失敗
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000001")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事1".to_string()))
    });
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000002")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事2".to_string()))
    });
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000003")).returning(|id| Err(anyhow::anyhow!("記事が見つかりません: {}", id)));

    let usecase = SelectPopularPostsUseCase::new(Arc::new(mock_repo));

    // Act
    let result = usecase
      .execute(vec![
        "00000000-0000-0000-0000-000000000001".to_string(),
        "00000000-0000-0000-0000-000000000002".to_string(),
        "00000000-0000-0000-0000-000000000003".to_string(), // 存在しない記事
      ])
      .await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("記事が見つかりません"));
  }

  #[tokio::test]
  async fn test_returns_error_when_empty_array_is_provided() {
    // Arrange
    let mock_repo = MockBlogPostRepo::new();
    let usecase = SelectPopularPostsUseCase::new(Arc::new(mock_repo));

    // Act
    let result = usecase.execute(vec![]).await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("人気記事は必ず3件です"));
  }

  #[tokio::test]
  async fn test_returns_error_when_repository_update_fails() {
    // Arrange
    let mut mock_repo = MockBlogPostRepo::new();

    // findメソッドの期待値設定
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000001")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事1".to_string()))
    });
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000002")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事2".to_string()))
    });
    mock_repo.expect_find().with(eq("00000000-0000-0000-0000-000000000003")).returning(|id| {
      let uuid = Uuid::parse_str(id).unwrap();
      Ok(BlogPostEntity::new(uuid, "記事3".to_string()))
    });

    // update_popular_postsメソッドでエラーを返す
    mock_repo.expect_update_popular_posts().returning(|_| Err(anyhow::anyhow!("更新に失敗しました")));

    let usecase = SelectPopularPostsUseCase::new(Arc::new(mock_repo));

    // Act
    let result = usecase
      .execute(vec![
        "00000000-0000-0000-0000-000000000001".to_string(),
        "00000000-0000-0000-0000-000000000002".to_string(),
        "00000000-0000-0000-0000-000000000003".to_string(),
      ])
      .await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("更新に失敗しました"));
  }
}

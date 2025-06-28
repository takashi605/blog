use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;

/// ピックアップ記事閲覧ユースケース
///
/// ピックアップ記事3件を取得し、DTOに変換して返す
pub struct ViewPickUpPostsUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl ViewPickUpPostsUseCase {
  /// 新しいユースケースインスタンスを作成する
  ///
  /// # Arguments
  /// * `repository` - ブログ記事リポジトリ
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  /// ピックアップ記事を取得する
  ///
  /// # Returns
  /// * `Ok(Vec<BlogPostDTO>)` - ピックアップ記事3件のDTOリスト
  /// * `Err` - データベースエラーの場合
  pub async fn execute(&self) -> anyhow::Result<Vec<BlogPostDTO>> {
    // リポジトリからピックアップ記事群を取得
    let pick_up_post_set = self.repository.find_pick_up_posts().await?;

    // PickUpPostSetEntityから記事を取得してBlogPostDTOに変換
    let posts = pick_up_post_set.into_all_posts();
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
  use mockall::mock;
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
      async fn find_all(&self) -> Result<Vec<BlogPostEntity>>;
    }
  }

  fn create_test_blog_post(id: &str, title: &str) -> BlogPostEntity {
    let uuid = Uuid::parse_str(id).unwrap();
    BlogPostEntity::new(uuid, title.to_string())
  }

  #[tokio::test]
  async fn test_can_retrieve_three_pickup_posts_successfully() {
    // Arrange
    let pick_up_posts = [
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "ピックアップ記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "ピックアップ記事2"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "ピックアップ記事3"),
    ];
    let _pick_up_post_set = PickUpPostSetEntity::new(pick_up_posts);

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_pick_up_posts().returning(move || {
      let posts = [
        create_test_blog_post("00000000-0000-0000-0000-000000000001", "ピックアップ記事1"),
        create_test_blog_post("00000000-0000-0000-0000-000000000002", "ピックアップ記事2"),
        create_test_blog_post("00000000-0000-0000-0000-000000000003", "ピックアップ記事3"),
      ];
      Ok(PickUpPostSetEntity::new(posts))
    });

    let usecase = ViewPickUpPostsUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute().await;

    // Assert
    assert!(result.is_ok());
    let dtos = result.unwrap();
    assert_eq!(dtos.len(), 3);
    assert_eq!(dtos[0].title, "ピックアップ記事1");
    assert_eq!(dtos[1].title, "ピックアップ記事2");
    assert_eq!(dtos[2].title, "ピックアップ記事3");
  }

  #[tokio::test]
  async fn test_pickup_post_ids_are_correctly_converted() {
    // Arrange
    let expected_id1 = "00000000-0000-0000-0000-000000000001";
    let expected_id2 = "00000000-0000-0000-0000-000000000002";
    let expected_id3 = "00000000-0000-0000-0000-000000000003";

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_pick_up_posts().returning(move || {
      let posts = [
        create_test_blog_post(expected_id1, "テスト記事1"),
        create_test_blog_post(expected_id2, "テスト記事2"),
        create_test_blog_post(expected_id3, "テスト記事3"),
      ];
      Ok(PickUpPostSetEntity::new(posts))
    });

    let usecase = ViewPickUpPostsUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute().await;

    // Assert
    assert!(result.is_ok());
    let dtos = result.unwrap();
    assert_eq!(dtos.len(), 3);
    assert_eq!(dtos[0].id, expected_id1);
    assert_eq!(dtos[0].title, "テスト記事1");
    assert_eq!(dtos[1].id, expected_id2);
    assert_eq!(dtos[1].title, "テスト記事2");
    assert_eq!(dtos[2].id, expected_id3);
    assert_eq!(dtos[2].title, "テスト記事3");
  }

  #[tokio::test]
  async fn test_returns_error_when_repository_has_invalid_count() {
    // Arrange: リポジトリでエラーを返すように設定
    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_pick_up_posts().returning(|| Err(anyhow::anyhow!("ピックアップ記事は3件である必要があります。実際の件数: 2")));

    let usecase = ViewPickUpPostsUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute().await;

    // Assert: エラーになることを確認
    assert!(result.is_err());
  }
}

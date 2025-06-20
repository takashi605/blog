use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
use crate::domain::blog_domain::pick_up_post_selector_service::PickUpPostSelectorService;

/// ピックアップ記事選択ユースケース
///
/// 指定された記事IDをピックアップ記事として選択し、更新する
pub struct SelectPickUpPostsUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl SelectPickUpPostsUseCase {
  /// 新しいユースケースインスタンスを作成する
  ///
  /// # Arguments
  /// * `repository` - ブログ記事リポジトリ
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  /// ピックアップ記事を選択・更新する
  ///
  /// # Arguments
  /// * `post_ids` - ピックアップ記事に設定する記事IDのリスト（3件必須）
  ///
  /// # Returns
  /// * `Ok(Vec<BlogPostDTO>)` - 更新後のピックアップ記事3件のDTOリスト
  /// * `Err` - 記事IDが3件でない場合、記事が見つからない場合、更新に失敗した場合
  pub async fn execute(&self, post_ids: Vec<String>) -> anyhow::Result<Vec<BlogPostDTO>> {
    // PickUpPostSelectorServiceを使用してピックアップ記事の選択と更新を行う
    let service = PickUpPostSelectorService::new(self.repository.clone());
    let updated_pick_up_post_set = service.select_pick_up_posts(post_ids).await?;

    // PickUpPostSetEntity -> Vec<BlogPostDTO>に変換
    let posts = updated_pick_up_post_set.into_all_posts();
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
      async fn find_pick_up_posts(&self) -> anyhow::Result<PickUpPostSetEntity>;
      async fn update_pick_up_posts(&self, pickup_posts: &PickUpPostSetEntity) -> anyhow::Result<PickUpPostSetEntity>;
      async fn find_popular_posts(&self) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
      async fn update_popular_posts(&self, popular_post_set: &crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
    }
  }

  #[tokio::test]
  async fn test_can_select_and_update_three_articles_as_pickup_posts() {
    // Arrange
    let post1_id = "00000000-0000-0000-0000-000000000001";
    let post2_id = "00000000-0000-0000-0000-000000000002";
    let post3_id = "00000000-0000-0000-0000-000000000003";

    let mut mock_repo = MockBlogPostRepo::new();
    
    // findメソッドの期待設定
    mock_repo.expect_find()
      .with(mockall::predicate::eq(post1_id))
      .returning(|id| {
        let uuid = Uuid::parse_str(id).unwrap();
        Ok(BlogPostEntity::new(uuid, "ピックアップ記事1".to_string()))
      });
    mock_repo.expect_find()
      .with(mockall::predicate::eq(post2_id))
      .returning(|id| {
        let uuid = Uuid::parse_str(id).unwrap();
        Ok(BlogPostEntity::new(uuid, "ピックアップ記事2".to_string()))
      });
    mock_repo.expect_find()
      .with(mockall::predicate::eq(post3_id))
      .returning(|id| {
        let uuid = Uuid::parse_str(id).unwrap();
        Ok(BlogPostEntity::new(uuid, "ピックアップ記事3".to_string()))
      });

    // update_pick_up_postsメソッドの期待設定
    mock_repo.expect_update_pick_up_posts()
      .times(1)
      .returning(|pick_up_post_set| {
        let posts = pick_up_post_set.get_all_posts();
        let new_posts = [
          BlogPostEntity::new(posts[0].get_id(), posts[0].get_title_text().to_string()),
          BlogPostEntity::new(posts[1].get_id(), posts[1].get_title_text().to_string()),
          BlogPostEntity::new(posts[2].get_id(), posts[2].get_title_text().to_string()),
        ];
        Ok(PickUpPostSetEntity::new(new_posts))
      });

    let usecase = SelectPickUpPostsUseCase::new(Arc::new(mock_repo));

    // Act
    let result = usecase.execute(vec![post1_id.to_string(), post2_id.to_string(), post3_id.to_string()]).await;

    // Assert
    assert!(result.is_ok());
    let dtos = result.unwrap();
    assert_eq!(dtos.len(), 3);
    assert_eq!(dtos[0].title, "ピックアップ記事1");
    assert_eq!(dtos[1].title, "ピックアップ記事2");
    assert_eq!(dtos[2].title, "ピックアップ記事3");
    assert_eq!(dtos[0].id, post1_id);
    assert_eq!(dtos[1].id, post2_id);
    assert_eq!(dtos[2].id, post3_id);
  }

  #[tokio::test]
  async fn test_returns_error_when_article_ids_are_not_exactly_three() {
    // Arrange
    let mock_repo = MockBlogPostRepo::new();
    let usecase = SelectPickUpPostsUseCase::new(Arc::new(mock_repo));

    // Act: 2件の場合
    let result = usecase
      .execute(vec![
        "00000000-0000-0000-0000-000000000001".to_string(),
        "00000000-0000-0000-0000-000000000002".to_string(),
      ])
      .await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("ピックアップ記事は必ず3件である必要があります"));
  }

  #[tokio::test]
  async fn test_returns_error_when_four_article_ids_are_provided() {
    // Arrange
    let mock_repo = MockBlogPostRepo::new();
    let usecase = SelectPickUpPostsUseCase::new(Arc::new(mock_repo));

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
    assert!(result.unwrap_err().to_string().contains("ピックアップ記事は必ず3件である必要があります"));
  }

  #[tokio::test]
  async fn test_returns_error_when_non_existent_article_id_is_specified() {
    // Arrange
    let mut mock_repo = MockBlogPostRepo::new();
    
    // 1番目と2番目の記事は正常に返す
    mock_repo.expect_find()
      .with(mockall::predicate::eq("00000000-0000-0000-0000-000000000001"))
      .returning(|id| {
        let uuid = Uuid::parse_str(id).unwrap();
        Ok(BlogPostEntity::new(uuid, "記事1".to_string()))
      });
    mock_repo.expect_find()
      .with(mockall::predicate::eq("00000000-0000-0000-0000-000000000002"))
      .returning(|id| {
        let uuid = Uuid::parse_str(id).unwrap();
        Ok(BlogPostEntity::new(uuid, "記事2".to_string()))
      });
    
    // 3番目の記事はエラーを返す
    mock_repo.expect_find()
      .with(mockall::predicate::eq("00000000-0000-0000-0000-000000000003"))
      .returning(|id| Err(anyhow::anyhow!("記事が見つかりません: {}", id)));

    let usecase = SelectPickUpPostsUseCase::new(Arc::new(mock_repo));

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
    let usecase = SelectPickUpPostsUseCase::new(Arc::new(mock_repo));

    // Act
    let result = usecase.execute(vec![]).await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("ピックアップ記事は必ず3件である必要があります"));
  }

  #[tokio::test]
  async fn test_returns_error_when_repository_update_fails() {
    // Arrange
    let mut mock_repo = MockBlogPostRepo::new();
    
    // findメソッドの設定
    mock_repo.expect_find()
      .with(mockall::predicate::eq("00000000-0000-0000-0000-000000000001"))
      .returning(|id| {
        let uuid = Uuid::parse_str(id).unwrap();
        Ok(BlogPostEntity::new(uuid, "記事1".to_string()))
      });
    mock_repo.expect_find()
      .with(mockall::predicate::eq("00000000-0000-0000-0000-000000000002"))
      .returning(|id| {
        let uuid = Uuid::parse_str(id).unwrap();
        Ok(BlogPostEntity::new(uuid, "記事2".to_string()))
      });
    mock_repo.expect_find()
      .with(mockall::predicate::eq("00000000-0000-0000-0000-000000000003"))
      .returning(|id| {
        let uuid = Uuid::parse_str(id).unwrap();
        Ok(BlogPostEntity::new(uuid, "記事3".to_string()))
      });
    
    // update_pick_up_postsメソッドは失敗を返す
    mock_repo.expect_update_pick_up_posts()
      .times(1)
      .returning(|_| Err(anyhow::anyhow!("更新に失敗しました")));

    let usecase = SelectPickUpPostsUseCase::new(Arc::new(mock_repo));

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
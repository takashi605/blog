use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper;
use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
use crate::domain::blog_domain::popular_post_selector_service::PopularPostSelectorService;

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
  use crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity;
  use crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity;
  use anyhow::Result;
  use async_trait::async_trait;
  use std::sync::Arc;
  use uuid::Uuid;

  // モックリポジトリ
  struct MockBlogPostRepository {
    // IDから記事タイトルへのマッピング
    find_results: std::collections::HashMap<String, String>,
    should_update_succeed: bool,
  }

  impl MockBlogPostRepository {
    fn new() -> Self {
      Self {
        find_results: std::collections::HashMap::new(),
        should_update_succeed: true,
      }
    }

    fn with_find_result(mut self, id: String, title: String) -> Self {
      self.find_results.insert(id, title);
      self
    }

    fn with_update_failure(mut self) -> Self {
      self.should_update_succeed = false;
      self
    }
  }

  #[async_trait]
  impl BlogPostRepository for MockBlogPostRepository {
    async fn find(&self, id: &str) -> Result<BlogPostEntity> {
      if let Some(title) = self.find_results.get(id) {
        let uuid = Uuid::parse_str(id).map_err(|_| anyhow::anyhow!("無効なUUID: {}", id))?;
        Ok(BlogPostEntity::new(uuid, title.clone()))
      } else {
        Err(anyhow::anyhow!("記事が見つかりません: {}", id))
      }
    }

    async fn save(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn find_latests(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn find_top_tech_pick(&self) -> Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity> {
      todo!()
    }

    async fn update_top_tech_pick_post(&self, _top_tech_pick: &crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity) -> Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity> {
      todo!()
    }

    async fn find_pick_up_posts(&self) -> Result<PickUpPostSetEntity> {
      todo!()
    }

    async fn update_pick_up_posts(&self, _pickup_posts: &PickUpPostSetEntity) -> Result<PickUpPostSetEntity> {
      todo!()
    }

    async fn find_popular_posts(&self) -> Result<PopularPostSetEntity> {
      todo!()
    }

    async fn update_popular_posts(&self, popular_post_set: &PopularPostSetEntity) -> Result<PopularPostSetEntity> {
      if self.should_update_succeed {
        // 入力された PopularPostSetEntity を元に新しいエンティティを作成して返す
        let posts = popular_post_set.get_all_posts();
        let new_posts = [
          BlogPostEntity::new(posts[0].get_id(), posts[0].get_title_text().to_string()),
          BlogPostEntity::new(posts[1].get_id(), posts[1].get_title_text().to_string()),
          BlogPostEntity::new(posts[2].get_id(), posts[2].get_title_text().to_string()),
        ];
        Ok(PopularPostSetEntity::new(new_posts))
      } else {
        Err(anyhow::anyhow!("更新に失敗しました"))
      }
    }
  }

  fn create_test_blog_post(id: &str, title: &str) -> BlogPostEntity {
    let uuid = Uuid::parse_str(id).unwrap();
    BlogPostEntity::new(uuid, title.to_string())
  }

  #[tokio::test]
  async fn 正常に3件の記事を人気記事として選択・更新できる() {
    // Arrange
    let post1_id = "00000000-0000-0000-0000-000000000001";
    let post2_id = "00000000-0000-0000-0000-000000000002";
    let post3_id = "00000000-0000-0000-0000-000000000003";

    let mock_repo = Arc::new(
      MockBlogPostRepository::new()
        .with_find_result(post1_id.to_string(), "人気記事1".to_string())
        .with_find_result(post2_id.to_string(), "人気記事2".to_string())
        .with_find_result(post3_id.to_string(), "人気記事3".to_string()),
    );

    let usecase = SelectPopularPostsUseCase::new(mock_repo);

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
  async fn 記事idが3件でない場合はエラーになる() {
    // Arrange
    let mock_repo = Arc::new(MockBlogPostRepository::new());
    let usecase = SelectPopularPostsUseCase::new(mock_repo);

    // Act: 2件の場合
    let result = usecase
      .execute(vec![
        "00000000-0000-0000-0000-000000000001".to_string(),
        "00000000-0000-0000-0000-000000000002".to_string(),
      ])
      .await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("人気記事は必ず3件である必要があります"));
  }

  #[tokio::test]
  async fn 記事idが4件の場合はエラーになる() {
    // Arrange
    let mock_repo = Arc::new(MockBlogPostRepository::new());
    let usecase = SelectPopularPostsUseCase::new(mock_repo);

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
    assert!(result.unwrap_err().to_string().contains("人気記事は必ず3件である必要があります"));
  }

  #[tokio::test]
  async fn 存在しない記事idを指定した場合はエラーになる() {
    // Arrange
    let mock_repo = Arc::new(
      MockBlogPostRepository::new()
        .with_find_result("00000000-0000-0000-0000-000000000001".to_string(), "記事1".to_string())
        .with_find_result("00000000-0000-0000-0000-000000000002".to_string(), "記事2".to_string()),
      // 3番目の記事は設定しない（存在しない）
    );

    let usecase = SelectPopularPostsUseCase::new(mock_repo);

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
  async fn 空の配列を指定した場合はエラーになる() {
    // Arrange
    let mock_repo = Arc::new(MockBlogPostRepository::new());
    let usecase = SelectPopularPostsUseCase::new(mock_repo);

    // Act
    let result = usecase.execute(vec![]).await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("人気記事は必ず3件である必要があります"));
  }

  #[tokio::test]
  async fn リポジトリの更新処理が失敗した場合はエラーになる() {
    // Arrange
    let mock_repo = Arc::new(
      MockBlogPostRepository::new()
        .with_find_result("00000000-0000-0000-0000-000000000001".to_string(), "記事1".to_string())
        .with_find_result("00000000-0000-0000-0000-000000000002".to_string(), "記事2".to_string())
        .with_find_result("00000000-0000-0000-0000-000000000003".to_string(), "記事3".to_string())
        .with_update_failure(), // 更新失敗を設定
    );

    let usecase = SelectPopularPostsUseCase::new(mock_repo);

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

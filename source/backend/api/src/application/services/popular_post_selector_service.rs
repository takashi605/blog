use crate::domain::blog_domain::{blog_post_repository::BlogPostRepository, popular_post_set_entity::PopularPostSetEntity};
use anyhow::Result;
use std::sync::Arc;

/// 人気記事選択ドメインサービス
///
/// 人気記事の選択と更新を行うビジネスロジックを提供する
pub struct PopularPostSelectorService {
  repository: Arc<dyn BlogPostRepository>,
}

impl PopularPostSelectorService {
  /// 新しいサービスインスタンスを作成する
  ///
  /// # Arguments
  /// * `repository` - ブログ記事リポジトリ
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  /// 指定されたIDの記事を人気記事として選択し、更新する
  ///
  /// # Arguments
  /// * `post_ids` - 人気記事に設定する記事IDの配列
  ///
  /// # Returns
  /// * `Ok(PopularPostSetEntity)` - 更新された人気記事群
  /// * `Err` - 記事が見つからない場合、または人気記事の変換に失敗した場合
  pub async fn select_popular_posts(&self, post_ids: Vec<String>) -> Result<PopularPostSetEntity> {
    // 各記事をリポジトリから取得
    let mut blog_posts = Vec::new();
    for post_id in post_ids {
      let blog_post = self.repository.find(&post_id).await?;
      blog_posts.push(blog_post);
    }

    // Vec<BlogPostEntity>からPopularPostSetEntityに変換（件数検証も含む）
    let popular_post_set = PopularPostSetEntity::try_from(blog_posts)?;

    // リポジトリを通じて更新
    let updated_popular_post_set = self.repository.update_popular_posts(&popular_post_set).await?;

    Ok(updated_popular_post_set)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::{blog_post_entity::BlogPostEntity, pick_up_post_set_entity::PickUpPostSetEntity};
  use anyhow::anyhow;
  use async_trait::async_trait;
  use uuid::Uuid;

  // テスト用のモックリポジトリ
  struct MockBlogPostRepository {
    // IDから記事タイトルへのマッピング（所有権の問題を回避）
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
  }

  #[async_trait]
  impl BlogPostRepository for MockBlogPostRepository {
    async fn find(&self, id: &str) -> Result<BlogPostEntity> {
      if let Some(title) = self.find_results.get(id) {
        let uuid = Uuid::parse_str(id).map_err(|_| anyhow!("無効なUUID: {}", id))?;
        Ok(BlogPostEntity::new(uuid, title.clone()))
      } else {
        Err(anyhow!("記事が見つかりません: {}", id))
      }
    }

    async fn save(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      unimplemented!()
    }

    async fn update(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      unimplemented!()
    }

    async fn find_latests(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
      unimplemented!()
    }

    async fn find_top_tech_pick(&self) -> Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity> {
      unimplemented!()
    }

    async fn update_top_tech_pick_post(
      &self,
      _top_tech_pick: &crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity,
    ) -> Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity> {
      unimplemented!()
    }

    async fn find_pick_up_posts(&self) -> Result<PickUpPostSetEntity> {
      unimplemented!()
    }

    async fn update_pick_up_posts(&self, _pickup_posts: &PickUpPostSetEntity) -> Result<PickUpPostSetEntity> {
      unimplemented!()
    }

    async fn find_popular_posts(&self) -> Result<PopularPostSetEntity> {
      unimplemented!()
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
        Err(anyhow!("更新に失敗しました"))
      }
    }

    async fn find_all(&self) -> Result<Vec<BlogPostEntity>> {
      unimplemented!()
    }
  }

  #[tokio::test]
  async fn can_successfully_select_three_posts_as_popular_posts() {
    let post1_id = "00000000-0000-0000-0000-000000000001";
    let post2_id = "00000000-0000-0000-0000-000000000002";
    let post3_id = "00000000-0000-0000-0000-000000000003";

    let mock_repo = Arc::new(
      MockBlogPostRepository::new()
        .with_find_result(post1_id.to_string(), "人気記事1".to_string())
        .with_find_result(post2_id.to_string(), "人気記事2".to_string())
        .with_find_result(post3_id.to_string(), "人気記事3".to_string()),
    );

    let service = PopularPostSelectorService::new(mock_repo);

    let result = service.select_popular_posts(vec![post1_id.to_string(), post2_id.to_string(), post3_id.to_string()]).await;

    assert!(result.is_ok());
    let popular_set = result.unwrap();
    let posts = popular_set.get_all_posts();
    assert_eq!(posts[0].get_title_text(), "人気記事1");
    assert_eq!(posts[1].get_title_text(), "人気記事2");
    assert_eq!(posts[2].get_title_text(), "人気記事3");
  }

  #[tokio::test]
  async fn error_when_post_ids_are_not_three_items() {
    let mock_repo = Arc::new(
      MockBlogPostRepository::new()
        .with_find_result("00000000-0000-0000-0000-000000000001".to_string(), "記事1".to_string())
        .with_find_result("00000000-0000-0000-0000-000000000002".to_string(), "記事2".to_string()),
    );
    let service = PopularPostSelectorService::new(mock_repo);

    // 2件の場合
    let result = service
      .select_popular_posts(vec![
        "00000000-0000-0000-0000-000000000001".to_string(),
        "00000000-0000-0000-0000-000000000002".to_string(),
      ])
      .await;

    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("人気記事は必ず3件です"));
  }

  #[tokio::test]
  async fn error_when_post_ids_are_four_items() {
    let mock_repo = Arc::new(
      MockBlogPostRepository::new()
        .with_find_result("00000000-0000-0000-0000-000000000001".to_string(), "記事1".to_string())
        .with_find_result("00000000-0000-0000-0000-000000000002".to_string(), "記事2".to_string())
        .with_find_result("00000000-0000-0000-0000-000000000003".to_string(), "記事3".to_string())
        .with_find_result("00000000-0000-0000-0000-000000000004".to_string(), "記事4".to_string()),
    );
    let service = PopularPostSelectorService::new(mock_repo);

    // 4件の場合
    let result = service
      .select_popular_posts(vec![
        "00000000-0000-0000-0000-000000000001".to_string(),
        "00000000-0000-0000-0000-000000000002".to_string(),
        "00000000-0000-0000-0000-000000000003".to_string(),
        "00000000-0000-0000-0000-000000000004".to_string(),
      ])
      .await;

    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("人気記事は必ず3件です"));
  }

  #[tokio::test]
  async fn error_when_specifying_nonexistent_post_id() {
    let mock_repo = Arc::new(
      MockBlogPostRepository::new()
        .with_find_result("00000000-0000-0000-0000-000000000001".to_string(), "記事1".to_string())
        .with_find_result("00000000-0000-0000-0000-000000000002".to_string(), "記事2".to_string()), // 3番目の記事は設定しない（存在しない）
    );

    let service = PopularPostSelectorService::new(mock_repo);

    let result = service
      .select_popular_posts(vec![
        "00000000-0000-0000-0000-000000000001".to_string(),
        "00000000-0000-0000-0000-000000000002".to_string(),
        "00000000-0000-0000-0000-000000000003".to_string(), // 存在しない記事
      ])
      .await;

    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("記事が見つかりません"));
  }

  #[tokio::test]
  async fn error_when_specifying_empty_array() {
    let mock_repo = Arc::new(MockBlogPostRepository::new());
    let service = PopularPostSelectorService::new(mock_repo);

    let result = service.select_popular_posts(vec![]).await;

    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("人気記事は必ず3件です"));
  }
}

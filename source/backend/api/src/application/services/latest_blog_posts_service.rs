use crate::domain::blog_domain::{
  blog_post_entity::BlogPostEntity, blog_post_repository::BlogPostRepository, services::published_post_viewer_service::PublishedPostViewerService,
};
use anyhow::Result;
use std::sync::Arc;

/// 新着記事一覧アプリケーションサービス
///
/// 新着記事の取得と公開記事のフィルタリングを行うビジネスロジックを提供する
pub struct LatestBlogPostsService {
  repository: Arc<dyn BlogPostRepository>,
}

impl LatestBlogPostsService {
  /// 新しいサービスインスタンスを作成する
  ///
  /// # Arguments
  /// * `repository` - ブログ記事リポジトリ
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  /// 公開済みの新着記事一覧を取得する
  ///
  /// # Arguments
  /// * `quantity` - 取得する記事数（Noneの場合はデフォルト数）
  ///
  /// # Returns
  /// * `Ok(Vec<BlogPostEntity>)` - 公開済みの記事一覧（新着順）
  /// * `Err` - リポジトリエラーの場合
  pub async fn get_published_latest_posts(&self, quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
    // リポジトリから新着記事を取得（投稿日降順でソート済み）
    let blog_post_entities = self.repository.find_latests(quantity).await?;

    // 公開記事閲覧サービスで公開済み記事のみをフィルタ
    let published_post_viewer = PublishedPostViewerService::new();
    let published_posts = published_post_viewer.filter_published_posts(blog_post_entities);

    Ok(published_posts)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
  use crate::domain::blog_domain::jst_date_vo::JstDate;
  use mockall::mock;
  use uuid::Uuid;

  mock! {
      BlogPostRepo {}

      #[async_trait::async_trait]
      impl BlogPostRepository for BlogPostRepo {
          async fn find(&self, id: &str) -> Result<BlogPostEntity>;
          async fn save(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity>;
          async fn update(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity>;
          async fn find_latests(&self, quantity: Option<u32>) -> Result<Vec<BlogPostEntity>>;
          async fn find_top_tech_pick(&self) -> Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
          async fn update_top_tech_pick_post(&self, top_tech_pick: &crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity) -> Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
          async fn find_pick_up_posts(&self) -> Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
          async fn update_pick_up_posts(&self, pickup_posts: &crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity) -> Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
          async fn find_popular_posts(&self) -> Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
          async fn update_popular_posts(&self, popular_post_set: &crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity) -> Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
          async fn find_all(&self) -> Result<Vec<BlogPostEntity>>;
      }
  }

  // ヘルパー関数: テスト用のBlogPostEntityを作成
  fn create_test_blog_post_with_published_date(title: &str, published_date: JstDate) -> BlogPostEntity {
    let id = Uuid::new_v4();
    let mut post = BlogPostEntity::new(id, title.to_string());
    post.set_published_date(published_date);
    post
  }

  #[tokio::test]
  async fn returns_only_published_posts() {
    // Arrange
    let past_date = JstDate::new(2024, 1, 1).unwrap(); // 公開済み
    let future_date = JstDate::new(3000, 12, 31).unwrap(); // 未公開

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_latests().with(mockall::predicate::eq(None)).times(1).returning(move |_| {
      Ok(vec![
        create_test_blog_post_with_published_date("公開済み記事1", past_date.clone()),
        create_test_blog_post_with_published_date("未公開記事", future_date.clone()),
        create_test_blog_post_with_published_date("公開済み記事2", past_date.clone()),
      ])
    });

    let service = LatestBlogPostsService::new(Arc::new(mock_repository));

    // Act
    let result = service.get_published_latest_posts(None).await;

    // Assert
    assert!(result.is_ok());
    let published_posts = result.unwrap();
    assert_eq!(published_posts.len(), 2); // 公開済み記事のみ
    assert_eq!(published_posts[0].get_title_text(), "公開済み記事1");
    assert_eq!(published_posts[1].get_title_text(), "公開済み記事2");
  }

  #[tokio::test]
  async fn returns_empty_list_when_no_published_posts() {
    // Arrange
    let future_date = JstDate::new(3000, 12, 31).unwrap(); // 未公開

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_latests().with(mockall::predicate::eq(None)).times(1).returning(move |_| {
      Ok(vec![
        create_test_blog_post_with_published_date("未公開記事1", future_date.clone()),
        create_test_blog_post_with_published_date("未公開記事2", future_date.clone()),
      ])
    });

    let service = LatestBlogPostsService::new(Arc::new(mock_repository));

    // Act
    let result = service.get_published_latest_posts(None).await;

    // Assert
    assert!(result.is_ok());
    let published_posts = result.unwrap();
    assert_eq!(published_posts.len(), 0);
  }

  #[tokio::test]
  async fn returns_all_posts_when_all_are_published() {
    // Arrange
    let past_date = JstDate::new(2024, 1, 1).unwrap(); // 公開済み

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_latests().with(mockall::predicate::eq(None)).times(1).returning(move |_| {
      Ok(vec![
        create_test_blog_post_with_published_date("公開済み記事1", past_date.clone()),
        create_test_blog_post_with_published_date("公開済み記事2", past_date.clone()),
        create_test_blog_post_with_published_date("公開済み記事3", past_date.clone()),
      ])
    });

    let service = LatestBlogPostsService::new(Arc::new(mock_repository));

    // Act
    let result = service.get_published_latest_posts(None).await;

    // Assert
    assert!(result.is_ok());
    let published_posts = result.unwrap();
    assert_eq!(published_posts.len(), 3);
    assert_eq!(published_posts[0].get_title_text(), "公開済み記事1");
    assert_eq!(published_posts[1].get_title_text(), "公開済み記事2");
    assert_eq!(published_posts[2].get_title_text(), "公開済み記事3");
  }

  #[tokio::test]
  async fn returns_empty_list_when_repository_returns_empty() {
    // Arrange
    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_latests().with(mockall::predicate::eq(None)).times(1).returning(|_| Ok(Vec::new()));

    let service = LatestBlogPostsService::new(Arc::new(mock_repository));

    // Act
    let result = service.get_published_latest_posts(None).await;

    // Assert
    assert!(result.is_ok());
    let published_posts = result.unwrap();
    assert_eq!(published_posts.len(), 0);
  }

  #[tokio::test]
  async fn returns_error_when_repository_fails() {
    // Arrange
    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_latests().with(mockall::predicate::eq(None)).times(1).returning(|_| Err(anyhow::anyhow!("データベースエラー")));

    let service = LatestBlogPostsService::new(Arc::new(mock_repository));

    // Act
    let result = service.get_published_latest_posts(None).await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("データベースエラー"));
  }

  #[tokio::test]
  async fn maintains_order_after_filtering() {
    // Arrange
    let date1 = JstDate::new(2024, 1, 3).unwrap(); // 新しい
    let date2 = JstDate::new(2024, 1, 2).unwrap(); // 中間
    let date3 = JstDate::new(2024, 1, 1).unwrap(); // 古い
    let future_date = JstDate::new(3000, 12, 31).unwrap(); // 未公開

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_find_latests().with(mockall::predicate::eq(None)).times(1).returning(move |_| {
      // 新着順（降順）で並んだデータ（途中に未公開記事を挿入）
      Ok(vec![
        create_test_blog_post_with_published_date("新しい記事", date1.clone()),
        create_test_blog_post_with_published_date("未公開記事", future_date.clone()),
        create_test_blog_post_with_published_date("中間の記事", date2.clone()),
        create_test_blog_post_with_published_date("古い記事", date3.clone()),
      ])
    });

    let service = LatestBlogPostsService::new(Arc::new(mock_repository));

    // Act
    let result = service.get_published_latest_posts(None).await;

    // Assert
    assert!(result.is_ok());
    let published_posts = result.unwrap();
    assert_eq!(published_posts.len(), 3);

    // 新着順が保持されていることを確認
    assert_eq!(published_posts[0].get_title_text(), "新しい記事");
    assert_eq!(published_posts[0].get_published_date(), &JstDate::new(2024, 1, 3).unwrap());

    assert_eq!(published_posts[1].get_title_text(), "中間の記事");
    assert_eq!(published_posts[1].get_published_date(), &JstDate::new(2024, 1, 2).unwrap());

    assert_eq!(published_posts[2].get_title_text(), "古い記事");
    assert_eq!(published_posts[2].get_published_date(), &JstDate::new(2024, 1, 1).unwrap());
  }
}

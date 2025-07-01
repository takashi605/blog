use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
use crate::domain::blog_domain::errors::blog_domain_error::BlogDomainError;
use crate::domain::blog_domain::jst_date_vo::JstDate;

/// 公開記事閲覧サービス
///
/// ブログ記事の公開状態を確認し、公開済みの記事のみを閲覧可能にするドメインサービス
pub struct PublishedPostViewerService;

impl PublishedPostViewerService {
  /// 新しいサービスインスタンスを作成する
  pub fn new() -> Self {
    Self
  }

  /// フィルタリング用：公開記事のみを抽出する
  ///
  /// # Arguments
  /// * `blog_posts` - フィルタリング対象のブログ記事エンティティのベクタ
  ///
  /// # Returns
  /// * `Vec<BlogPostEntity>` - 公開済みの記事のみを含むベクタ
  pub fn filter_published_posts(&self, blog_posts: Vec<BlogPostEntity>) -> Vec<BlogPostEntity> {
    blog_posts.into_iter().filter(|post| post.is_published()).collect()
  }

  /// アクセス制御用：公開記事を閲覧する
  ///
  /// # Arguments
  /// * `blog_post` - 閲覧対象のブログ記事エンティティ
  ///
  /// # Returns
  /// * `Ok(BlogPostEntity)` - 記事が公開済みの場合、記事エンティティを返却
  /// * `Err(BlogDomainError::UnpublishedPostAccess)` - 記事が未公開の場合、エラーを返却
  pub fn view_published_post(&self, blog_post: BlogPostEntity) -> Result<BlogPostEntity, BlogDomainError> {
    if blog_post.is_published() {
      Ok(blog_post)
    } else {
      Err(BlogDomainError::UnpublishedPostAccess {
        post_title: blog_post.get_title_text().to_string(),
      })
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use uuid::Uuid;

  fn create_test_blog_post(id: &str, title: &str) -> BlogPostEntity {
    let uuid = Uuid::parse_str(id).unwrap();
    BlogPostEntity::new(uuid, title.to_string())
  }

  #[test]
  fn filter_published_posts_returns_only_published_posts() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let past_date = JstDate::new(2024, 1, 1).unwrap(); // 公開済み
    let future_date = JstDate::new(3000, 12, 31).unwrap(); // 未公開

    let mut published_post1 = create_test_blog_post("00000000-0000-0000-0000-000000000001", "公開済み記事1");
    published_post1.set_published_date(past_date.clone());

    let mut unpublished_post = create_test_blog_post("00000000-0000-0000-0000-000000000002", "未公開記事");
    unpublished_post.set_published_date(future_date.clone());

    let mut published_post2 = create_test_blog_post("00000000-0000-0000-0000-000000000003", "公開済み記事2");
    published_post2.set_published_date(past_date);

    let blog_posts = vec![published_post1, unpublished_post, published_post2];

    // Act
    let result = service.filter_published_posts(blog_posts);

    // Assert
    assert_eq!(result.len(), 2);
    assert_eq!(result[0].get_title_text(), "公開済み記事1");
    assert_eq!(result[1].get_title_text(), "公開済み記事2");
  }

  #[test]
  fn filter_published_posts_returns_empty_when_no_published_posts() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let future_date = JstDate::new(3000, 12, 31).unwrap(); // 未公開

    let mut unpublished_post1 = create_test_blog_post("00000000-0000-0000-0000-000000000001", "未公開記事1");
    unpublished_post1.set_published_date(future_date.clone());

    let mut unpublished_post2 = create_test_blog_post("00000000-0000-0000-0000-000000000002", "未公開記事2");
    unpublished_post2.set_published_date(future_date);

    let blog_posts = vec![unpublished_post1, unpublished_post2];

    // Act
    let result = service.filter_published_posts(blog_posts);

    // Assert
    assert_eq!(result.len(), 0);
  }

  #[test]
  fn view_published_post_returns_ok_when_post_is_published() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let mut blog_post = create_test_blog_post("00000000-0000-0000-0000-000000000003", "公開済み記事");

    // 過去の日付で公開日を設定（公開済み状態）
    let past_date = JstDate::new(2024, 1, 1).unwrap();
    blog_post.set_published_date(past_date);

    // Act
    let result = service.view_published_post(blog_post);

    // Assert
    assert!(result.is_ok());
    let returned_post = result.unwrap();
    assert_eq!(returned_post.get_title_text(), "公開済み記事");
  }

  #[test]
  fn view_published_post_returns_error_when_post_is_not_published() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let mut blog_post = create_test_blog_post("00000000-0000-0000-0000-000000000004", "未公開記事");

    // 未来の日付で公開日を設定（未公開状態）
    let future_date = JstDate::new(3000, 12, 31).unwrap();
    blog_post.set_published_date(future_date);

    // Act
    let result = service.view_published_post(blog_post);

    // Assert
    assert!(result.is_err());
    let error = result.unwrap_err();
    assert_eq!(
      error,
      BlogDomainError::UnpublishedPostAccess {
        post_title: "未公開記事".to_string(),
      }
    );
    assert_eq!(error.to_string(), "未公開記事「未公開記事」にアクセスすることはできません");
  }

  #[test]
  fn filter_published_posts_includes_posts_published_today() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let blog_post = create_test_blog_post("00000000-0000-0000-0000-000000000005", "今日公開記事");

    // 今日の日付はデフォルトで設定されるため、そのままテスト
    // new()で作成した記事は published_date が今日に設定される

    let blog_posts = vec![blog_post];

    // Act
    let result = service.filter_published_posts(blog_posts);

    // Assert
    assert_eq!(result.len(), 1);
    assert_eq!(result[0].get_title_text(), "今日公開記事");
  }

  #[test]
  fn filter_published_posts_preserves_post_content_and_order() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let past_date = JstDate::new(2024, 1, 1).unwrap();

    let mut blog_post1 = create_test_blog_post("00000000-0000-0000-0000-000000000006", "内容確認記事1");
    blog_post1.set_published_date(past_date.clone());
    let original_id1 = blog_post1.get_id();

    let mut blog_post2 = create_test_blog_post("00000000-0000-0000-0000-000000000007", "内容確認記事2");
    blog_post2.set_published_date(past_date);
    let original_id2 = blog_post2.get_id();

    let blog_posts = vec![blog_post1, blog_post2];

    // Act
    let result = service.filter_published_posts(blog_posts);

    // Assert
    assert_eq!(result.len(), 2);
    assert_eq!(result[0].get_id(), original_id1);
    assert_eq!(result[0].get_title_text(), "内容確認記事1");
    assert_eq!(result[1].get_id(), original_id2);
    assert_eq!(result[1].get_title_text(), "内容確認記事2");
  }

  #[test]
  fn filter_published_posts_returns_empty_for_empty_input() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let blog_posts = Vec::new();

    // Act
    let result = service.filter_published_posts(blog_posts);

    // Assert
    assert_eq!(result.len(), 0);
  }
}

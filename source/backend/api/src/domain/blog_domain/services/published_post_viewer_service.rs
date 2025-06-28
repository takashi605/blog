use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;

/// 公開記事閲覧サービス
///
/// ブログ記事の公開状態を確認し、公開済みの記事のみを閲覧可能にするドメインサービス
pub struct PublishedPostViewerService;

impl PublishedPostViewerService {
  /// 新しいサービスインスタンスを作成する
  pub fn new() -> Self {
    Self
  }

  /// 公開記事を閲覧する
  ///
  /// # Arguments
  /// * `blog_post` - 閲覧対象のブログ記事エンティティ
  ///
  /// # Returns
  /// * `Some(BlogPostEntity)` - 記事が公開済みの場合、記事エンティティを返却
  /// * `None` - 記事が未公開の場合、Noneを返却
  pub fn view_published_post(&self, blog_post: BlogPostEntity) -> Option<BlogPostEntity> {
    if blog_post.is_published() {
      Some(blog_post)
    } else {
      None
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use chrono::NaiveDate;
  use uuid::Uuid;

  fn create_test_blog_post(id: &str, title: &str) -> BlogPostEntity {
    let uuid = Uuid::parse_str(id).unwrap();
    BlogPostEntity::new(uuid, title.to_string())
  }

  #[test]
  fn returns_some_when_post_is_published() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let mut blog_post = create_test_blog_post("00000000-0000-0000-0000-000000000001", "公開済み記事");
    
    // 過去の日付で公開日を設定（公開済み状態）
    let past_date = NaiveDate::from_ymd_opt(2024, 1, 1).unwrap();
    blog_post.set_published_date(past_date);

    // Act
    let result = service.view_published_post(blog_post);

    // Assert
    assert!(result.is_some());
    let returned_post = result.unwrap();
    assert_eq!(returned_post.get_title_text(), "公開済み記事");
  }

  #[test]
  fn returns_none_when_post_is_not_published() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let mut blog_post = create_test_blog_post("00000000-0000-0000-0000-000000000002", "未公開記事");
    
    // 未来の日付で公開日を設定（未公開状態）
    let future_date = NaiveDate::from_ymd_opt(3000, 12, 31).unwrap();
    blog_post.set_published_date(future_date);

    // Act
    let result = service.view_published_post(blog_post);

    // Assert
    assert!(result.is_none());
  }

  #[test]
  fn returns_some_when_post_is_published_today() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let blog_post = create_test_blog_post("00000000-0000-0000-0000-000000000003", "今日公開記事");
    
    // 今日の日付はデフォルトで設定されるため、そのままテスト
    // new()で作成した記事は published_date が今日に設定される

    // Act
    let result = service.view_published_post(blog_post);

    // Assert
    assert!(result.is_some());
    let returned_post = result.unwrap();
    assert_eq!(returned_post.get_title_text(), "今日公開記事");
  }

  #[test]
  fn service_preserves_post_content_when_published() {
    // Arrange
    let service = PublishedPostViewerService::new();
    let blog_post = create_test_blog_post("00000000-0000-0000-0000-000000000004", "内容確認記事");
    let original_id = blog_post.get_id();
    let original_title = blog_post.get_title_text().to_string();

    // Act
    let result = service.view_published_post(blog_post);

    // Assert
    assert!(result.is_some());
    let returned_post = result.unwrap();
    assert_eq!(returned_post.get_id(), original_id);
    assert_eq!(returned_post.get_title_text(), original_title);
  }
}
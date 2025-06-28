use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;

/// ピックアップ記事群エンティティ
///
/// ビジネスルール: ピックアップ記事は必ず3件存在する
#[derive(Debug)]
pub struct PickUpPostSetEntity {
  posts: [BlogPostEntity; 3],
}

impl PickUpPostSetEntity {
  /// 新しいピックアップ記事群を作成する
  ///
  /// # Arguments
  /// * `posts` - ピックアップ記事の配列（必ず3件）
  ///
  /// # Returns
  /// * `PickUpPostSetEntity` - ピックアップ記事群エンティティ
  pub fn new(posts: [BlogPostEntity; 3]) -> Self {
    Self { posts }
  }

  /// 全てのピックアップ記事を取得する
  ///
  /// # Returns
  /// * `&[BlogPostEntity; 3]` - ピックアップ記事の配列への参照（3件固定）
  pub fn get_all_posts(&self) -> &[BlogPostEntity; 3] {
    &self.posts
  }

  /// 全てのピックアップ記事を移動して取得する
  ///
  /// # Returns
  /// * `[BlogPostEntity; 3]` - ピックアップ記事の配列（3件固定）
  pub fn into_all_posts(self) -> [BlogPostEntity; 3] {
    self.posts
  }
}

impl TryFrom<Vec<BlogPostEntity>> for PickUpPostSetEntity {
  type Error = anyhow::Error;

  fn try_from(value: Vec<BlogPostEntity>) -> Result<Self, Self::Error> {
    let arr: [BlogPostEntity; 3] = value.try_into().map_err(|_| anyhow::anyhow!("ピックアップ記事は必ず3件です"))?;
    Ok(Self::new(arr))
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
  fn can_create_pick_up_post_set_with_three_posts() {
    let posts = [
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "ピックアップ記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "ピックアップ記事2"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "ピックアップ記事3"),
    ];

    let pick_up_post_set = PickUpPostSetEntity::new(posts);

    let all_posts = pick_up_post_set.get_all_posts();
    assert_eq!(all_posts.len(), 3);
    assert_eq!(all_posts[0].get_title_text(), "ピックアップ記事1");
    assert_eq!(all_posts[1].get_title_text(), "ピックアップ記事2");
    assert_eq!(all_posts[2].get_title_text(), "ピックアップ記事3");
  }

  #[test]
  fn can_retrieve_all_pick_up_posts() {
    let posts = [
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事A"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事B"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "記事C"),
    ];

    let pick_up_post_set = PickUpPostSetEntity::new(posts);
    let retrieved_posts = pick_up_post_set.get_all_posts();

    assert_eq!(retrieved_posts.len(), 3);
    assert_eq!(retrieved_posts[0].get_title_text(), "記事A");
    assert_eq!(retrieved_posts[1].get_title_text(), "記事B");
    assert_eq!(retrieved_posts[2].get_title_text(), "記事C");
  }

  #[test]
  fn pick_up_post_ids_are_correctly_maintained() {
    let posts = [
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事2"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "記事3"),
    ];

    let pick_up_post_set = PickUpPostSetEntity::new(posts);
    let retrieved_posts = pick_up_post_set.get_all_posts();

    assert_eq!(retrieved_posts[0].get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap());
    assert_eq!(retrieved_posts[1].get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap());
    assert_eq!(retrieved_posts[2].get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap());
  }

  #[test]
  fn can_create_pick_up_post_set_from_vec_with_three_posts() {
    let posts = vec![
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事2"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "記事3"),
    ];

    let result = PickUpPostSetEntity::try_from(posts);

    assert!(result.is_ok());
    let pick_up_post_set = result.unwrap();
    let all_posts = pick_up_post_set.get_all_posts();
    assert_eq!(all_posts[0].get_title_text(), "記事1");
    assert_eq!(all_posts[1].get_title_text(), "記事2");
    assert_eq!(all_posts[2].get_title_text(), "記事3");
  }

  #[test]
  fn error_when_creating_pick_up_post_set_from_vec_with_two_posts() {
    let posts = vec![
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事2"),
    ];

    let result = PickUpPostSetEntity::try_from(posts);

    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("ピックアップ記事は必ず3件です"));
  }

  #[test]
  fn error_when_creating_pick_up_post_set_from_vec_with_four_posts() {
    let posts = vec![
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事2"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "記事3"),
      create_test_blog_post("00000000-0000-0000-0000-000000000004", "記事4"),
    ];

    let result = PickUpPostSetEntity::try_from(posts);

    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("ピックアップ記事は必ず3件です"));
  }

  #[test]
  fn error_when_creating_pick_up_post_set_from_empty_vec() {
    let posts = vec![];

    let result = PickUpPostSetEntity::try_from(posts);

    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("ピックアップ記事は必ず3件です"));
  }
}

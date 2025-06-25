use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;

/// 人気記事群エンティティ
///
/// ビジネスルール: 人気記事は必ず3件存在する
#[derive(Debug)]
pub struct PopularPostSetEntity {
  posts: [BlogPostEntity; 3],
}

impl PopularPostSetEntity {
  /// 新しい人気記事群を作成する
  ///
  /// # Arguments
  /// * `posts` - 人気記事の配列（必ず3件）
  ///
  /// # Returns
  /// * `PopularPostSetEntity` - 人気記事群エンティティ
  pub fn new(posts: [BlogPostEntity; 3]) -> Self {
    Self { posts }
  }

  /// 全ての人気記事を取得する
  ///
  /// # Returns
  /// * `&[BlogPostEntity; 3]` - 人気記事の配列への参照（3件固定）
  pub fn get_all_posts(&self) -> &[BlogPostEntity; 3] {
    &self.posts
  }

  /// 全ての人気記事を移動して取得する
  ///
  /// # Returns
  /// * `[BlogPostEntity; 3]` - 人気記事の配列（3件固定）
  pub fn into_all_posts(self) -> [BlogPostEntity; 3] {
    self.posts
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
  fn can_create_popular_post_set_with_three_posts() {
    let posts = [
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "人気記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "人気記事2"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "人気記事3"),
    ];

    let popular_post_set = PopularPostSetEntity::new(posts);

    let all_posts = popular_post_set.get_all_posts();
    assert_eq!(all_posts.len(), 3);
    assert_eq!(all_posts[0].get_title_text(), "人気記事1");
    assert_eq!(all_posts[1].get_title_text(), "人気記事2");
    assert_eq!(all_posts[2].get_title_text(), "人気記事3");
  }

  #[test]
  fn can_retrieve_all_popular_posts() {
    let posts = [
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事A"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事B"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "記事C"),
    ];

    let popular_post_set = PopularPostSetEntity::new(posts);
    let retrieved_posts = popular_post_set.get_all_posts();

    assert_eq!(retrieved_posts.len(), 3);
    assert_eq!(retrieved_posts[0].get_title_text(), "記事A");
    assert_eq!(retrieved_posts[1].get_title_text(), "記事B");
    assert_eq!(retrieved_posts[2].get_title_text(), "記事C");
  }

  #[test]
  fn popular_post_ids_are_correctly_maintained() {
    let posts = [
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事2"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "記事3"),
    ];

    let popular_post_set = PopularPostSetEntity::new(posts);
    let retrieved_posts = popular_post_set.get_all_posts();

    assert_eq!(retrieved_posts[0].get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap());
    assert_eq!(retrieved_posts[1].get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap());
    assert_eq!(retrieved_posts[2].get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap());
  }
}

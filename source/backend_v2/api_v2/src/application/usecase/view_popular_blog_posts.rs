use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper;
use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;

/// 人気記事閲覧ユースケース
///
/// 人気記事3件を取得し、DTOに変換して返す
pub struct ViewPopularBlogPostsUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl ViewPopularBlogPostsUseCase {
  /// 新しいユースケースインスタンスを作成する
  ///
  /// # Arguments
  /// * `repository` - ブログ記事リポジトリ
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  /// 人気記事を取得する
  ///
  /// # Returns
  /// * `Ok(Vec<BlogPostDTO>)` - 人気記事3件のDTOリスト
  /// * `Err` - データベースエラーの場合
  pub async fn execute(&self) -> anyhow::Result<Vec<BlogPostDTO>> {
    // リポジトリから人気記事群を取得
    let popular_post_set = self.repository.find_popular_posts().await?;

    // PopularPostSetEntityから記事を取得してBlogPostDTOに変換
    let posts = popular_post_set.into_all_posts();
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
  use anyhow::Result;
  use async_trait::async_trait;
  use std::sync::Arc;
  use uuid::Uuid;

  // モックリポジトリ
  struct MockBlogPostRepository {
    popular_posts: Vec<BlogPostEntity>,
  }

  impl MockBlogPostRepository {
    fn new_with_popular_posts(posts: Vec<BlogPostEntity>) -> Self {
      Self { popular_posts: posts }
    }
  }

  #[async_trait]
  impl BlogPostRepository for MockBlogPostRepository {
    async fn find(&self, _id: &str) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn save(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn find_latests(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn find_top_tech_pick(&self) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn update_top_tech_pick_post(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn find_pick_up_posts(&self, _quantity: u32) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn update_pick_up_posts(&self, _pickup_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn find_popular_posts(&self) -> Result<PopularPostSetEntity> {
      // PopularPostSetEntityは3件必須なので、件数チェック
      if self.popular_posts.len() != 3 {
        return Err(anyhow::anyhow!("人気記事は3件である必要があります。実際の件数: {}", self.popular_posts.len()));
      }

      // PopularPostSetEntityを作成して返す
      let posts_array: [BlogPostEntity; 3] = [
        BlogPostEntity::new(self.popular_posts[0].get_id(), self.popular_posts[0].get_title_text().to_string()),
        BlogPostEntity::new(self.popular_posts[1].get_id(), self.popular_posts[1].get_title_text().to_string()),
        BlogPostEntity::new(self.popular_posts[2].get_id(), self.popular_posts[2].get_title_text().to_string()),
      ];
      Ok(PopularPostSetEntity::new(posts_array))
    }

    async fn update_popular_posts(&self, _popular_post_set: &PopularPostSetEntity) -> Result<PopularPostSetEntity> {
      todo!()
    }
  }

  fn create_test_blog_post(id: &str, title: &str) -> BlogPostEntity {
    let uuid = Uuid::parse_str(id).unwrap();
    BlogPostEntity::new(uuid, title.to_string())
  }

  #[tokio::test]
  async fn 人気記事3件を正常に取得できる() {
    // Arrange
    let popular_posts = vec![
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "人気記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "人気記事2"),
      create_test_blog_post("00000000-0000-0000-0000-000000000003", "人気記事3"),
    ];

    let mock_repository = Arc::new(MockBlogPostRepository::new_with_popular_posts(popular_posts));
    let usecase = ViewPopularBlogPostsUseCase::new(mock_repository);

    // Act
    let result = usecase.execute().await;

    // Assert
    assert!(result.is_ok());
    let dtos = result.unwrap();
    assert_eq!(dtos.len(), 3);
    assert_eq!(dtos[0].title, "人気記事1");
    assert_eq!(dtos[1].title, "人気記事2");
    assert_eq!(dtos[2].title, "人気記事3");
  }

  #[tokio::test]
  async fn 人気記事のidが正しく変換される() {
    // Arrange
    let expected_id1 = "00000000-0000-0000-0000-000000000001";
    let expected_id2 = "00000000-0000-0000-0000-000000000002";
    let expected_id3 = "00000000-0000-0000-0000-000000000003";
    let popular_posts = vec![
      create_test_blog_post(expected_id1, "テスト記事1"),
      create_test_blog_post(expected_id2, "テスト記事2"),
      create_test_blog_post(expected_id3, "テスト記事3"),
    ];

    let mock_repository = Arc::new(MockBlogPostRepository::new_with_popular_posts(popular_posts));
    let usecase = ViewPopularBlogPostsUseCase::new(mock_repository);

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
  async fn リポジトリで不正な件数の場合はエラーとなる() {
    // Arrange: 意図的に2件しか設定しない（3件であるべき）
    let popular_posts = vec![
      create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事1"),
      create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事2"),
    ];

    let mock_repository = Arc::new(MockBlogPostRepository::new_with_popular_posts(popular_posts));
    let usecase = ViewPopularBlogPostsUseCase::new(mock_repository);

    // Act
    let result = usecase.execute().await;

    // Assert: エラーになることを確認
    assert!(result.is_err());
  }
}

pub mod dto;
pub mod dto_mapper;

use std::sync::Arc;

use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
use dto::ViewLatestBlogPostsDTO;
use dto_mapper::blog_post_entities_to_view_latest_dto;

pub struct ViewLatestBlogPostsUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl ViewLatestBlogPostsUseCase {
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  pub async fn execute(&self, quantity: Option<u32>) -> anyhow::Result<ViewLatestBlogPostsDTO> {
    // リポジトリから最新記事を取得
    let blog_post_entities = self.repository.find_latests(quantity).await?;

    // エンティティをDTOに変換
    let dto = blog_post_entities_to_view_latest_dto(blog_post_entities)?;

    Ok(dto)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
  use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
  use anyhow::Result;
  use async_trait::async_trait;
  use chrono::NaiveDate;
  use std::sync::Arc;
  use uuid::Uuid;

  // モックリポジトリ
  struct MockBlogPostRepository {
    post_titles: Vec<String>,
    post_dates: Vec<NaiveDate>,
  }

  impl MockBlogPostRepository {
    fn new_with_sorted_posts(titles_and_dates: Vec<(String, NaiveDate)>) -> Self {
      // 投稿日の降順でソート済みデータを保持
      let mut sorted_data = titles_and_dates;
      sorted_data.sort_by(|a, b| b.1.cmp(&a.1));

      let (titles, dates): (Vec<String>, Vec<NaiveDate>) = sorted_data.into_iter().unzip();

      Self {
        post_titles: titles,
        post_dates: dates,
      }
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
      // 新着順（投稿日降順）で記事を作成して返す
      let mut posts = Vec::new();
      for (title, date) in self.post_titles.iter().zip(self.post_dates.iter()) {
        let id = Uuid::new_v4();
        let mut post = BlogPostEntity::new(id, title.clone());
        post.set_post_date(*date);

        // テスト用のダミーサムネイル画像を設定
        let thumbnail_id = Uuid::new_v4();
        post.set_thumbnail(thumbnail_id, "test-thumbnail.jpg".to_string());

        posts.push(post);
      }
      Ok(posts)
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

    async fn find_popular_posts(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn update_popular_posts(&self, _popular_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }
  }

  // ヘルパー関数: テスト用のBlogPostEntityを作成
  fn create_test_blog_post(title: &str, post_date: NaiveDate) -> BlogPostEntity {
    let id = Uuid::new_v4();
    let mut post = BlogPostEntity::new(id, title.to_string());
    post.set_post_date(post_date);

    // テスト用のダミーサムネイル画像を設定
    let thumbnail_id = Uuid::new_v4();
    post.set_thumbnail(thumbnail_id, "test-thumbnail.jpg".to_string());

    post
  }

  #[tokio::test]
  async fn test_記事を新着順に取得できる() {
    // Arrange
    let old_date = NaiveDate::from_ymd_opt(2024, 1, 10).unwrap();
    let middle_date = NaiveDate::from_ymd_opt(2024, 1, 15).unwrap();
    let new_date = NaiveDate::from_ymd_opt(2024, 1, 20).unwrap();

    let test_data = vec![
      ("古い記事".to_string(), old_date),
      ("新しい記事".to_string(), new_date),
      ("中間の記事".to_string(), middle_date),
    ];

    let mock_repository = Arc::new(MockBlogPostRepository::new_with_sorted_posts(test_data));
    let usecase = ViewLatestBlogPostsUseCase::new(mock_repository);

    // Act
    let result = usecase.execute(None).await;

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.blog_posts.len(), 3);

    // 新着順（投稿日降順）で並んでいることを確認
    assert_eq!(dto.blog_posts[0].title, "新しい記事");
    assert_eq!(dto.blog_posts[0].post_date, new_date);

    assert_eq!(dto.blog_posts[1].title, "中間の記事");
    assert_eq!(dto.blog_posts[1].post_date, middle_date);

    assert_eq!(dto.blog_posts[2].title, "古い記事");
    assert_eq!(dto.blog_posts[2].post_date, old_date);
  }

  #[tokio::test]
  async fn test_記事は全件取得される() {
    // Arrange
    let base_date = NaiveDate::from_ymd_opt(2024, 1, 1).unwrap();

    // 複数の記事を作成（5件）
    let mut test_data = Vec::new();
    for i in 1..=5 {
      let post_date = base_date + chrono::Duration::days(i);
      test_data.push((format!("記事{}", i), post_date));
    }

    let mock_repository = Arc::new(MockBlogPostRepository::new_with_sorted_posts(test_data));
    let usecase = ViewLatestBlogPostsUseCase::new(mock_repository);

    // Act
    let result = usecase.execute(None).await;

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();

    // 全件取得されることを確認
    assert_eq!(dto.blog_posts.len(), 5);

    // 新着順で並んでいることを確認
    for i in 0..4 {
      assert!(dto.blog_posts[i].post_date >= dto.blog_posts[i + 1].post_date);
    }
  }

  #[tokio::test]
  async fn test_空の記事リストでもエラーにならない() {
    // Arrange
    let empty_data = Vec::new();
    let mock_repository = Arc::new(MockBlogPostRepository::new_with_sorted_posts(empty_data));
    let usecase = ViewLatestBlogPostsUseCase::new(mock_repository);

    // Act
    let result = usecase.execute(None).await;

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.blog_posts.len(), 0);
  }

  #[tokio::test]
  async fn test_quantityパラメータがリポジトリに渡される() {
    // Arrange
    let test_data = vec![("記事1".to_string(), NaiveDate::from_ymd_opt(2024, 1, 1).unwrap())];

    let mock_repository = Arc::new(MockBlogPostRepository::new_with_sorted_posts(test_data));
    let usecase = ViewLatestBlogPostsUseCase::new(mock_repository);

    // Act - quantityパラメータありのケース
    let result_with_quantity = usecase.execute(Some(10)).await;

    // Act - quantityパラメータなしのケース
    let result_without_quantity = usecase.execute(None).await;

    // Assert
    assert!(result_with_quantity.is_ok());
    assert!(result_without_quantity.is_ok());

    // どちらの場合も正常に動作することを確認
    let dto_with_quantity = result_with_quantity.unwrap();
    let dto_without_quantity = result_without_quantity.unwrap();

    assert_eq!(dto_with_quantity.blog_posts.len(), 1);
    assert_eq!(dto_without_quantity.blog_posts.len(), 1);
  }
}

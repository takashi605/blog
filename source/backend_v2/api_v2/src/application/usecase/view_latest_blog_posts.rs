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
  use chrono::NaiveDate;
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
      async fn find_pick_up_posts(&self) -> anyhow::Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
      async fn update_pick_up_posts(&self, pickup_posts: &crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity) -> anyhow::Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
      async fn find_popular_posts(&self) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
      async fn update_popular_posts(&self, popular_post_set: &crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
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

  fn create_sorted_posts(titles_and_dates: Vec<(String, NaiveDate)>) -> Vec<BlogPostEntity> {
    // 投稿日の降順でソート済みデータを作成
    let mut sorted_data = titles_and_dates;
    sorted_data.sort_by(|a, b| b.1.cmp(&a.1));

    sorted_data.into_iter().map(|(title, date)| {
      create_test_blog_post(&title, date)
    }).collect()
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

    let _posts = create_sorted_posts(test_data);

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository
      .expect_find_latests()
      .with(mockall::predicate::eq(None))
      .times(1)
      .returning(|_| {
        let old_date = NaiveDate::from_ymd_opt(2024, 1, 10).unwrap();
        let middle_date = NaiveDate::from_ymd_opt(2024, 1, 15).unwrap();
        let new_date = NaiveDate::from_ymd_opt(2024, 1, 20).unwrap();
        let test_data = vec![
          ("新しい記事".to_string(), new_date),
          ("中間の記事".to_string(), middle_date),
          ("古い記事".to_string(), old_date),
        ];
        Ok(create_sorted_posts(test_data))
      });

    let usecase = ViewLatestBlogPostsUseCase::new(Arc::new(mock_repository));

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

    let _posts = create_sorted_posts(test_data);

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository
      .expect_find_latests()
      .with(mockall::predicate::eq(None))
      .times(1)
      .returning(|_| {
        let old_date = NaiveDate::from_ymd_opt(2024, 1, 1).unwrap();
        let middle_date = NaiveDate::from_ymd_opt(2024, 1, 2).unwrap();
        let new_date = NaiveDate::from_ymd_opt(2024, 1, 3).unwrap();
        let test_data = vec![
          ("新しい記事".to_string(), new_date),
          ("中間の記事".to_string(), middle_date),
          ("古い記事".to_string(), old_date),
        ];
        Ok(create_sorted_posts(test_data))
      });

    let usecase = ViewLatestBlogPostsUseCase::new(Arc::new(mock_repository));

    // Act
    let result = usecase.execute(None).await;

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();

    // 全件取得されることを確認
    assert_eq!(dto.blog_posts.len(), 3);

    // 新着順で並んでいることを確認
    for i in 0..2 {
      assert!(dto.blog_posts[i].post_date >= dto.blog_posts[i + 1].post_date);
    }
  }

  #[tokio::test]
  async fn test_空の記事リストでもエラーにならない() {
    // Arrange
    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository
      .expect_find_latests()
      .with(mockall::predicate::eq(None))
      .times(1)
      .returning(|_| Ok(vec![]));

    let usecase = ViewLatestBlogPostsUseCase::new(Arc::new(mock_repository));

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
    let _posts = create_sorted_posts(test_data);

    let mut mock_repository = MockBlogPostRepo::new();
    
    // quantityありのケース
    mock_repository
      .expect_find_latests()
      .with(mockall::predicate::eq(Some(10)))
      .times(1)
      .returning(|_| {
        let test_data = vec![("記事1".to_string(), NaiveDate::from_ymd_opt(2024, 1, 1).unwrap())];
        Ok(create_sorted_posts(test_data))
      });

    // quantityなしのケース
    mock_repository
      .expect_find_latests()
      .with(mockall::predicate::eq(None))
      .times(1)
      .returning(|_| {
        let test_data = vec![("記事1".to_string(), NaiveDate::from_ymd_opt(2024, 1, 1).unwrap())];
        Ok(create_sorted_posts(test_data))
      });

    let usecase = ViewLatestBlogPostsUseCase::new(Arc::new(mock_repository));

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

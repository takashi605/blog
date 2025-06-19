use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper;
use crate::domain::blog_domain::blog_post_factory::BlogPostFactory;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
use domain_data_mapper::convert_dto_to_domain_input;
use dto::CreateBlogPostDTO;

pub mod domain_data_mapper;
pub mod dto;

pub struct CreateBlogPostUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl CreateBlogPostUseCase {
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  pub async fn execute(&self, dto: CreateBlogPostDTO) -> anyhow::Result<BlogPostDTO> {
    // DTOをドメイン入力に変換
    let domain_input = convert_dto_to_domain_input(dto);

    // ファクトリでBlogPostEntityを作成
    let blog_post = BlogPostFactory::create(domain_input);

    // リポジトリで保存
    let saved_blog_post = self.repository.save(&blog_post).await?;

    // BlogPostEntityをBlogPostDTOに変換
    let result_dto = dto_mapper::convert_to_blog_post_dto(saved_blog_post);

    Ok(result_dto)
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
  use dto::{CreateBlogPostDTO, CreateImageDTO};
  use std::sync::{Arc, Mutex};
  use uuid::Uuid;

  // モックリポジトリ
  #[derive(Clone)]
  struct MockBlogPostRepository {
    save_count: Arc<Mutex<usize>>,
  }

  impl MockBlogPostRepository {
    fn new() -> Self {
      Self {
        save_count: Arc::new(Mutex::new(0)),
      }
    }

    fn get_save_count(&self) -> usize {
      *self.save_count.lock().unwrap()
    }

    fn reset_save_count(&self) {
      *self.save_count.lock().unwrap() = 0;
    }
  }

  #[async_trait]
  impl BlogPostRepository for MockBlogPostRepository {
    async fn find(&self, _id: &str) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn save(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      // 保存回数をカウント
      *self.save_count.lock().unwrap() += 1;

      // 新しいBlogPostEntityを作成して返す（実際のリポジトリではDBから取得した値を返す想定）
      let mut new_post = BlogPostEntity::new(blog_post.get_id(), blog_post.get_title_text().to_string());

      // サムネイルを設定
      if let Some(thumbnail) = blog_post.get_thumbnail() {
        new_post.set_thumbnail(thumbnail.get_id(), thumbnail.get_path().to_string());
      }

      // 投稿日を設定
      new_post.set_post_date(blog_post.get_post_date());

      // コンテンツを設定（簡略化）
      for _content in blog_post.get_contents() {
        // 実際の実装では、コンテンツの複製が必要になる場合があります
        // ここでは簡略化してコンテンツは追加しません
      }

      Ok(new_post)
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
      todo!()
    }

    async fn update_popular_posts(&self, _popular_post_set: &crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity) -> Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity> {
      todo!()
    }
  }

  // テスト用データ作成ヘルパー
  fn create_test_dto(title: &str, thumbnail_id: Uuid) -> CreateBlogPostDTO {
    CreateBlogPostDTO {
      title: title.to_string(),
      thumbnail: CreateImageDTO {
        id: thumbnail_id,
        path: "path/to/thumbnail.jpg".to_string(),
      },
      post_date: None,
      last_update_date: None,
      contents: vec![],
    }
  }

  #[tokio::test]
  async fn test_記事作成用データをファクトリとリポジトリで処理する() {
    // Arrange
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let dto = create_test_dto("テスト記事", thumbnail_id);

    let mock_repository = Arc::new(MockBlogPostRepository::new());
    let usecase = CreateBlogPostUseCase::new(mock_repository.clone());

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_ok());
    let blog_post_dto = result.unwrap();
    assert_eq!(blog_post_dto.title, "テスト記事");

    // サムネイルが正しく設定されていることを確認
    assert_eq!(blog_post_dto.thumbnail.id, thumbnail_id);
    assert_eq!(blog_post_dto.thumbnail.path, "path/to/thumbnail.jpg");

    // saveメソッドが呼ばれたことを確認
    assert_eq!(mock_repository.get_save_count(), 1);
  }

  #[tokio::test]
  async fn test_ファクトリで生成されたIDが保持される() {
    // Arrange
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap();
    let dto = create_test_dto("ID確認記事", thumbnail_id);

    let mock_repository = Arc::new(MockBlogPostRepository::new());
    let usecase = CreateBlogPostUseCase::new(mock_repository.clone());

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_ok());
    let blog_post_dto = result.unwrap();

    // ファクトリで自動生成されたIDが正しく設定されていることを確認
    let id_uuid = Uuid::parse_str(&blog_post_dto.id).unwrap();
    assert_ne!(id_uuid, Uuid::nil());
    assert_eq!(id_uuid.get_version_num(), 4); // UUID v4

    // saveメソッドが呼ばれたことを確認
    assert_eq!(mock_repository.get_save_count(), 1);
  }

  #[tokio::test]
  async fn test_リポジトリのsaveメソッドが呼び出される() {
    // Arrange
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap();
    let dto = create_test_dto("保存確認記事", thumbnail_id);

    let mock_repository = Arc::new(MockBlogPostRepository::new());
    let usecase = CreateBlogPostUseCase::new(mock_repository.clone());

    // saveメソッドの呼び出し回数をリセット
    mock_repository.reset_save_count();

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_ok());
    assert_eq!(mock_repository.get_save_count(), 1); // saveメソッドが1回呼ばれることを確認
  }
}

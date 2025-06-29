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
  blog_post_factory: Arc<BlogPostFactory>,
}

impl CreateBlogPostUseCase {
  pub fn new(repository: Arc<dyn BlogPostRepository>, blog_post_factory: Arc<BlogPostFactory>) -> Self {
    Self { repository, blog_post_factory }
  }

  pub async fn execute(&self, dto: CreateBlogPostDTO) -> anyhow::Result<BlogPostDTO> {
    // DTOをドメイン入力に変換
    let domain_input = convert_dto_to_domain_input(dto);

    // ファクトリでBlogPostEntityを作成
    let blog_post = self.blog_post_factory.create(domain_input).await?;

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
  use crate::domain::blog_domain::image_content_factory::ImageContentFactory;
  use crate::domain::image_domain::{image_entity::ImageEntity, image_repository::ImageRepository, image_repository::ImageRepositoryError};
  use async_trait::async_trait;
  use dto::{CreateBlogPostDTO, CreateImageDTO};
  use mockall::mock;
  use std::collections::HashMap;
  use std::sync::Arc;
  use uuid::Uuid;

  mock! {
    BlogPostRepo {}

    #[async_trait::async_trait]
    impl BlogPostRepository for BlogPostRepo {
      async fn find(&self, id: &str) -> anyhow::Result<BlogPostEntity>;
      async fn save(&self, blog_post: &BlogPostEntity) -> anyhow::Result<BlogPostEntity>;
      async fn update(&self, blog_post: &BlogPostEntity) -> anyhow::Result<BlogPostEntity>;
      async fn find_latests(&self, quantity: Option<u32>) -> anyhow::Result<Vec<BlogPostEntity>>;
      async fn find_top_tech_pick(&self) -> anyhow::Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
      async fn update_top_tech_pick_post(&self, top_tech_pick: &crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity) -> anyhow::Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
      async fn find_pick_up_posts(&self) -> anyhow::Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
      async fn update_pick_up_posts(&self, pickup_posts: &crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity) -> anyhow::Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
      async fn find_popular_posts(&self) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
      async fn update_popular_posts(&self, popular_post_set: &crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
      async fn find_all(&self) -> anyhow::Result<Vec<BlogPostEntity>>;
    }
  }

  // テスト用のモックImageRepository
  pub struct MockImageRepository {
    images: HashMap<String, ImageEntity>,
  }

  impl MockImageRepository {
    pub fn new() -> Self {
      Self { images: HashMap::new() }
    }

    pub fn add_image(&mut self, path: String, image: ImageEntity) {
      self.images.insert(path, image);
    }
  }

  #[async_trait]
  impl ImageRepository for MockImageRepository {
    async fn find(&self, _id: &str) -> Result<ImageEntity, ImageRepositoryError> {
      Err(ImageRepositoryError::FindFailed("not implemented".to_string()))
    }

    async fn find_by_path(&self, path: &str) -> Result<ImageEntity, ImageRepositoryError> {
      match self.images.get(path) {
        Some(image) => Ok(ImageEntity::new(image.get_id(), image.get_path().to_string())),
        None => Err(ImageRepositoryError::FindByPathFailed(format!("Image not found for path: {}", path))),
      }
    }

    async fn save(&self, _image: ImageEntity) -> Result<ImageEntity, ImageRepositoryError> {
      Err(ImageRepositoryError::SaveFailed("not implemented".to_string()))
    }

    async fn find_all(&self) -> Result<Vec<ImageEntity>, ImageRepositoryError> {
      Err(ImageRepositoryError::FindAllFailed("not implemented".to_string()))
    }
  }

  // テスト用のファクトリ作成ヘルパー
  fn create_test_factory() -> Arc<BlogPostFactory> {
    let mut mock_image_repo = MockImageRepository::new();

    // テスト用の画像を追加
    let image_id = Uuid::new_v4();
    let image_path = "path/to/thumbnail.jpg".to_string();
    let image = ImageEntity::new(image_id, image_path.clone());
    mock_image_repo.add_image(image_path, image);

    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_image_repo)));
    Arc::new(BlogPostFactory::new(image_factory))
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
      published_date: None,
      contents: vec![],
    }
  }

  #[tokio::test]
  async fn test_processes_blog_post_creation_data_with_factory_and_repository() {
    // Arrange
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let dto = create_test_dto("テスト記事", thumbnail_id);

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_save().times(1).returning(move |blog_post| {
      let mut new_post = BlogPostEntity::new(blog_post.get_id(), blog_post.get_title_text().to_string());
      if let Some(thumbnail) = blog_post.get_thumbnail() {
        new_post.set_thumbnail(thumbnail.get_id(), thumbnail.get_path().to_string());
      }
      new_post.set_post_date(blog_post.get_post_date());
      Ok(new_post)
    });

    let factory = create_test_factory();
    let usecase = CreateBlogPostUseCase::new(Arc::new(mock_repository), factory);

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_ok());
    let blog_post_dto = result.unwrap();
    assert_eq!(blog_post_dto.title, "テスト記事");

    // サムネイルが正しく設定されていることを確認
    assert_eq!(blog_post_dto.thumbnail.id, thumbnail_id);
    assert_eq!(blog_post_dto.thumbnail.path, "path/to/thumbnail.jpg");
  }

  #[tokio::test]
  async fn test_factory_generated_id_is_preserved() {
    // Arrange
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap();
    let dto = create_test_dto("ID確認記事", thumbnail_id);

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_save().times(1).returning(move |blog_post| {
      let mut new_post = BlogPostEntity::new(blog_post.get_id(), blog_post.get_title_text().to_string());
      if let Some(thumbnail) = blog_post.get_thumbnail() {
        new_post.set_thumbnail(thumbnail.get_id(), thumbnail.get_path().to_string());
      }
      new_post.set_post_date(blog_post.get_post_date());
      Ok(new_post)
    });

    let factory = create_test_factory();
    let usecase = CreateBlogPostUseCase::new(Arc::new(mock_repository), factory);

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_ok());
    let blog_post_dto = result.unwrap();

    // ファクトリで自動生成されたIDが正しく設定されていることを確認
    let id_uuid = Uuid::parse_str(&blog_post_dto.id).unwrap();
    assert_ne!(id_uuid, Uuid::nil());
    assert_eq!(id_uuid.get_version_num(), 4); // UUID v4
  }

  #[tokio::test]
  async fn test_repository_save_method_is_called() {
    // Arrange
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap();
    let dto = create_test_dto("保存確認記事", thumbnail_id);

    let mut mock_repository = MockBlogPostRepo::new();
    mock_repository.expect_save().times(1).returning(move |blog_post| {
      let mut new_post = BlogPostEntity::new(blog_post.get_id(), blog_post.get_title_text().to_string());
      if let Some(thumbnail) = blog_post.get_thumbnail() {
        new_post.set_thumbnail(thumbnail.get_id(), thumbnail.get_path().to_string());
      }
      new_post.set_post_date(blog_post.get_post_date());
      Ok(new_post)
    });

    let factory = create_test_factory();
    let usecase = CreateBlogPostUseCase::new(Arc::new(mock_repository), factory);

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_ok());
  }
}

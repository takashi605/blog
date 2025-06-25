use std::sync::Arc;

use anyhow::{Context, Result};

use crate::{
  application::dto::BlogPostDTO,
  application::dto_mapper,
  domain::blog_domain::{blog_post_repository::BlogPostRepository, top_tech_pick_entity::TopTechPickEntity},
};

/// トップテック記事選択ユースケース
///
/// 指定された記事をトップテック記事として設定する
pub struct SelectTopTechPickPostUseCase {
  blog_post_repository: Arc<dyn BlogPostRepository>,
}

impl SelectTopTechPickPostUseCase {
  /// 新しいSelectTopTechPickPostUseCaseインスタンスを作成する
  ///
  /// # Arguments
  /// * `blog_post_repository` - ブログ記事リポジトリ
  pub fn new(blog_post_repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { blog_post_repository }
  }

  /// 指定された記事をトップテック記事として設定する
  ///
  /// # Arguments
  /// * `post_id` - トップテック記事として設定する記事のID
  ///
  /// # Returns
  /// * `Ok(BlogPostDTO)` - 更新されたトップテック記事のDTO
  /// * `Err` - 記事が見つからないか、更新エラーが発生した場合
  pub async fn execute(&self, post_id: String) -> Result<BlogPostDTO> {
    // 指定された記事が存在することを確認
    let blog_post = self.blog_post_repository.find(&post_id).await.context(format!("記事ID {} が見つかりません", post_id))?;

    // BlogPostEntityからTopTechPickEntityを作成
    let top_tech_pick = TopTechPickEntity::new(blog_post);

    // トップテック記事として更新
    let updated_top_tech_pick = self.blog_post_repository.update_top_tech_pick_post(&top_tech_pick).await.context("トップテック記事の更新に失敗しました")?;

    // TopTechPickEntityからBlogPostEntityを取得してDTOへ変換
    let dto = dto_mapper::convert_to_blog_post_dto(updated_top_tech_pick.into_post());

    Ok(dto)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::{
    blog_post_entity::BlogPostEntity,
    blog_post_factory::{BlogPostFactory, CreateBlogPostInput, CreateImageInput},
    image_content_factory::ImageContentFactory,
  };
  use crate::domain::image_domain::{image_entity::ImageEntity, image_repository::ImageRepository, image_repository::ImageRepositoryError};
  use async_trait::async_trait;
  use mockall::mock;
  use std::collections::HashMap;
  use std::sync::Arc;

  // モックリポジトリの定義
  mock! {
      BlogPostRepositoryImpl {}

      #[async_trait::async_trait]
      impl BlogPostRepository for BlogPostRepositoryImpl {
          async fn find(&self, id: &str) -> Result<BlogPostEntity>;
          async fn save(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity>;
          async fn find_latests(&self, quantity: Option<u32>) -> Result<Vec<BlogPostEntity>>;
          async fn find_top_tech_pick(&self) -> Result<TopTechPickEntity>;
          async fn update_top_tech_pick_post(&self, top_tech_pick: &TopTechPickEntity) -> Result<TopTechPickEntity>;
          async fn find_pick_up_posts(&self) -> Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
          async fn update_pick_up_posts(&self, pickup_posts: &crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity) -> Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
          async fn find_popular_posts(&self) -> Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
          async fn update_popular_posts(&self, popular_post_set: &crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity) -> Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
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
  async fn create_test_factory_and_blog_post(title: &str, thumbnail_path: Option<&str>) -> (Arc<BlogPostFactory>, BlogPostEntity) {
    let mut mock_image_repo = MockImageRepository::new();

    // テスト用の画像を追加
    if let Some(path) = thumbnail_path {
      let image_id = uuid::Uuid::new_v4();
      let image = ImageEntity::new(image_id, path.to_string());
      mock_image_repo.add_image(path.to_string(), image);
    }

    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_image_repo)));
    let factory = Arc::new(BlogPostFactory::new(image_factory));

    let input = CreateBlogPostInput {
      title: title.to_string(),
      thumbnail: thumbnail_path.map(|path| CreateImageInput {
        id: uuid::Uuid::new_v4(),
        path: path.to_string(),
      }),
      post_date: None,
      last_update_date: None,
      contents: vec![],
    };

    let blog_post = factory.create(input).await.unwrap();
    (factory, blog_post)
  }

  #[tokio::test]
  async fn test_execute_updates_top_tech_pick_post() {
    // Arrange
    let mut mock_repository = MockBlogPostRepositoryImpl::new();

    // テスト用のブログ記事を作成
    let (_factory, blog_post) = create_test_factory_and_blog_post("新しいトップテック記事", Some("https://example.com/new-thumbnail.jpg")).await;
    let post_id_str = blog_post.get_id().to_string();
    let expected_id = post_id_str.clone();

    // モックの設定（findメソッド）
    mock_repository.expect_find().withf(move |id| id == &post_id_str).times(1).returning(move |_| {
      // テスト用に簡単なブログ記事を返す
      Ok(BlogPostEntity::new(uuid::Uuid::new_v4(), "新しいトップテック記事".to_string()))
    });

    // モックの設定（update_top_tech_pick_postメソッド）
    mock_repository.expect_update_top_tech_pick_post().times(1).returning(|_| {
      // テスト用に簡単なエンティティを返す
      let mut updated_post = BlogPostEntity::new(uuid::Uuid::new_v4(), "更新されたトップテック記事".to_string());
      // サムネイルを設定
      updated_post.set_thumbnail(uuid::Uuid::new_v4(), "https://example.com/updated-thumbnail.jpg".to_string());
      Ok(TopTechPickEntity::new(updated_post))
    });

    let repository = Arc::new(mock_repository);
    let usecase = SelectTopTechPickPostUseCase::new(repository);

    // Act
    let result = usecase.execute(expected_id).await;

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    // 更新後の記事がDTOとして返されることを確認
    assert!(!dto.id.is_empty());
    assert_eq!(dto.title, "更新されたトップテック記事");
    assert_eq!(dto.thumbnail.path, "https://example.com/updated-thumbnail.jpg");
  }

  #[tokio::test]
  async fn test_execute_fails_when_post_not_found() {
    // Arrange
    let mut mock_repository = MockBlogPostRepositoryImpl::new();
    let post_id = "non-existent-id";
    let post_id_str = post_id.to_string();

    // モックの設定（記事が見つからない）
    mock_repository.expect_find().withf(move |id| id == &post_id_str).times(1).return_once(|_| Err(anyhow::anyhow!("記事が見つかりません")));

    let repository = Arc::new(mock_repository);
    let usecase = SelectTopTechPickPostUseCase::new(repository);

    // Act
    let result = usecase.execute(post_id.to_string()).await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("non-existent-id が見つかりません"));
  }

  #[tokio::test]
  async fn test_execute_propagates_update_error() {
    // Arrange
    let mut mock_repository = MockBlogPostRepositoryImpl::new();

    // テスト用のブログ記事を作成
    let (_factory, blog_post) = create_test_factory_and_blog_post("記事タイトル", None).await;
    let post_id_str = blog_post.get_id().to_string();

    // モックの設定（findメソッド）
    mock_repository.expect_find().withf(move |id| id == &post_id_str).times(1).returning(move |_| {
      // テスト用に簡単なブログ記事を返す
      Ok(BlogPostEntity::new(uuid::Uuid::new_v4(), "記事タイトル".to_string()))
    });

    // モックの設定（update_top_tech_pick_postメソッド - エラーを返す）
    mock_repository.expect_update_top_tech_pick_post().times(1).return_once(|_| Err(anyhow::anyhow!("データベースエラー")));

    let repository = Arc::new(mock_repository);
    let usecase = SelectTopTechPickPostUseCase::new(repository);

    // Act
    let result = usecase.execute(blog_post.get_id().to_string()).await;

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("トップテック記事の更新に失敗しました"));
  }
}

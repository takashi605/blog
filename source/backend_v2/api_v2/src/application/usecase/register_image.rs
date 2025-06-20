pub mod domain_data_mapper;
pub mod dto;

use std::sync::Arc;

use crate::application::dto::ImageDTO;
use crate::application::dto_mapper::image_dto_mapper::convert_to_image_dto;
use crate::domain::image_domain::image_factory::ImageFactory;
use crate::domain::image_domain::image_repository::{ImageRepository, ImageRepositoryError};

use self::domain_data_mapper::convert_dto_to_domain_input;
use self::dto::RegisterImageDTO;

#[derive(Debug, PartialEq)]
pub enum RegisterImageError {
  RepositoryError(String),
}

impl From<ImageRepositoryError> for RegisterImageError {
  fn from(error: ImageRepositoryError) -> Self {
    match error {
      ImageRepositoryError::FindFailed(msg) => RegisterImageError::RepositoryError(msg),
      ImageRepositoryError::FindByPathFailed(msg) => RegisterImageError::RepositoryError(msg),
      ImageRepositoryError::SaveFailed(msg) => RegisterImageError::RepositoryError(msg),
      ImageRepositoryError::FindAllFailed(msg) => RegisterImageError::RepositoryError(msg),
    }
  }
}

// RegisterImageUseCase構造体
pub struct RegisterImageUseCase {
  image_repository: Arc<dyn ImageRepository + Send + Sync>,
}

impl RegisterImageUseCase {
  pub fn new(image_repository: Arc<dyn ImageRepository + Send + Sync>) -> Self {
    Self { image_repository }
  }

  pub async fn execute(&self, dto: RegisterImageDTO) -> anyhow::Result<ImageDTO, RegisterImageError> {
    // 1. DTOをドメイン入力に変換
    let domain_input = convert_dto_to_domain_input(dto);

    // 2. ImageFactoryでエンティティを生成（UUID自動割り当て）
    let image_entity = ImageFactory::create(domain_input);

    // 3. リポジトリで保存
    let saved_image = self.image_repository.save(image_entity).await?;

    // 4. ImageEntityをImageDTOに変換して返却
    let image_dto = convert_to_image_dto(saved_image);

    Ok(image_dto)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::image_domain::image_entity::ImageEntity;
  use crate::domain::image_domain::image_repository::{ImageRepository, ImageRepositoryError};
  use mockall::mock;
  use uuid::Uuid;

  mock! {
    ImageRepo {}

    #[async_trait::async_trait]
    impl ImageRepository for ImageRepo {
      async fn find(&self, id: &str) -> Result<ImageEntity, ImageRepositoryError>;
      async fn find_by_path(&self, path: &str) -> Result<ImageEntity, ImageRepositoryError>;
      async fn save(&self, image: ImageEntity) -> Result<ImageEntity, ImageRepositoryError>;
      async fn find_all(&self) -> Result<Vec<ImageEntity>, ImageRepositoryError>;
    }
  }

  #[tokio::test]
  async fn test_execute_basic_image_registration_succeeds() {
    // Arrange
    let mut mock_repo = MockImageRepo::new();
    mock_repo.expect_save().times(1).returning(|image| Ok(image));

    let usecase = RegisterImageUseCase::new(Arc::new(mock_repo));
    let dto = RegisterImageDTO {
      path: "images/test.jpg".to_string(),
    };

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_ok());
    let image_dto = result.unwrap();
    assert_eq!(image_dto.path, "images/test.jpg");
    assert_ne!(image_dto.id, Uuid::nil());
    assert_eq!(image_dto.id.get_version_num(), 4); // UUID v4確認
  }

  #[tokio::test]
  async fn test_execute_registration_succeeds_with_different_image_paths() {
    let test_cases = vec!["images/photo.png", "uploads/avatar.gif", "media/screenshot.jpeg", "assets/logo.svg"];

    for path in test_cases {
      // Arrange
      let mut mock_repo = MockImageRepo::new();
      mock_repo.expect_save().times(1).returning(|image| Ok(image));

      let usecase = RegisterImageUseCase::new(Arc::new(mock_repo));
      let dto = RegisterImageDTO { path: path.to_string() };

      // Act
      let result = usecase.execute(dto).await;

      // Assert
      assert!(result.is_ok(), "{}の登録に失敗しました", path);
      let image_dto = result.unwrap();
      assert_eq!(image_dto.path, path);
      assert_ne!(image_dto.id, Uuid::nil());
    }
  }

  #[tokio::test]
  async fn test_execute_registration_succeeds_with_special_characters_in_path() {
    // Arrange
    let mut mock_repo = MockImageRepo::new();
    mock_repo.expect_save().times(1).returning(|image| Ok(image));

    let usecase = RegisterImageUseCase::new(Arc::new(mock_repo));
    let path_with_special_chars = "images/テスト画像_123-file.jpg";
    let dto = RegisterImageDTO {
      path: path_with_special_chars.to_string(),
    };

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_ok());
    let image_dto = result.unwrap();
    assert_eq!(image_dto.path, path_with_special_chars);
    assert_ne!(image_dto.id, Uuid::nil());
  }

  #[tokio::test]
  async fn test_execute_generates_different_uuid_each_time() {
    // Act - 複数回実行
    let mut generated_ids = std::collections::HashSet::new();
    for i in 0..5 {
      // Arrange
      let mut mock_repo = MockImageRepo::new();
      mock_repo.expect_save().times(1).returning(|image| Ok(image));

      let usecase = RegisterImageUseCase::new(Arc::new(mock_repo));
      let dto = RegisterImageDTO {
        path: format!("images/test{}.jpg", i),
      };
      let result = usecase.execute(dto).await;

      // Assert
      assert!(result.is_ok());
      let image_dto = result.unwrap();
      assert!(generated_ids.insert(image_dto.id), "重複したIDが生成されました: {}", image_dto.id);
    }

    // 5個の異なるIDが生成されたことを確認
    assert_eq!(generated_ids.len(), 5);
  }

  #[tokio::test]
  async fn test_execute_returns_error_when_repository_save_fails() {
    // Arrange
    let mut mock_repo = MockImageRepo::new();
    mock_repo.expect_save().times(1).returning(|_| Err(ImageRepositoryError::SaveFailed("保存に失敗しました".to_string())));

    let usecase = RegisterImageUseCase::new(Arc::new(mock_repo));
    let dto = RegisterImageDTO {
      path: "images/test.jpg".to_string(),
    };

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_err());
    let error = result.unwrap_err();
    assert_eq!(error, RegisterImageError::RepositoryError("保存に失敗しました".to_string()));
  }

  #[tokio::test]
  async fn test_execute_registration_succeeds_with_empty_path() {
    // Arrange
    let mut mock_repo = MockImageRepo::new();
    mock_repo.expect_save().times(1).returning(|image| Ok(image));

    let usecase = RegisterImageUseCase::new(Arc::new(mock_repo));
    let dto = RegisterImageDTO { path: "".to_string() };

    // Act
    let result = usecase.execute(dto).await;

    // Assert
    assert!(result.is_ok());
    let image_dto = result.unwrap();
    assert_eq!(image_dto.path, "");
    assert_ne!(image_dto.id, Uuid::nil());
  }
}

use crate::{
  domain::image_domain::image_repository::{ImageRepository, ImageRepositoryError},
  application::{dto::ImageDTO, dto_mapper::image_dto_mapper::convert_to_image_dto},
};
use std::sync::Arc;

/// 全画像取得ユースケース
pub struct ViewImagesUseCase {
  image_repository: Arc<dyn ImageRepository>,
}

impl ViewImagesUseCase {
  /// 新しいViewImagesUseCaseインスタンスを作成する
  pub fn new(image_repository: Arc<dyn ImageRepository>) -> Self {
    Self { image_repository }
  }

  /// 全画像を取得する
  pub async fn execute(&self) -> Result<Vec<ImageDTO>, ViewImagesError> {
    // リポジトリから全画像を取得
    let image_entities = self.image_repository.find_all().await.map_err(|err| match err {
      ImageRepositoryError::FindAllFailed(message) => ViewImagesError::RetrieveFailed(message),
      _ => ViewImagesError::UnexpectedError(format!("予期しないエラーが発生しました: {:?}", err)),
    })?;

    // ImageEntityをImageDTOに変換
    let image_dtos = image_entities
      .into_iter()
      .map(convert_to_image_dto)
      .collect();

    Ok(image_dtos)
  }
}

/// ViewImagesユースケースのエラー定義
#[derive(Debug, PartialEq)]
pub enum ViewImagesError {
  /// 画像取得に失敗
  RetrieveFailed(String),
  /// 予期しないエラー
  UnexpectedError(String),
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::{
    domain::image_domain::{
      image_entity::ImageEntity,
      image_repository::{ImageRepository, ImageRepositoryError},
    },
    application::dto::ImageDTO,
  };
  use async_trait::async_trait;
  use uuid::Uuid;

  // テスト用のモックリポジトリ
  struct MockImageRepository {
    should_fail: bool,
    images: Vec<ImageEntity>,
  }

  impl MockImageRepository {
    fn new() -> Self {
      Self {
        should_fail: false,
        images: vec![],
      }
    }

    fn with_images(images: Vec<ImageEntity>) -> Self {
      Self {
        should_fail: false,
        images,
      }
    }

    fn with_error() -> Self {
      Self {
        should_fail: true,
        images: vec![],
      }
    }
  }

  #[async_trait]
  impl ImageRepository for MockImageRepository {
    async fn find(&self, _id: &str) -> Result<ImageEntity, ImageRepositoryError> {
      unreachable!("findメソッドはこのテストでは呼ばれません")
    }

    async fn save(&self, _image: ImageEntity) -> Result<ImageEntity, ImageRepositoryError> {
      unreachable!("saveメソッドはこのテストでは呼ばれません")
    }

    async fn find_all(&self) -> Result<Vec<ImageEntity>, ImageRepositoryError> {
      if self.should_fail {
        return Err(ImageRepositoryError::FindAllFailed(
          "テスト用のエラーです".to_string(),
        ));
      }
      // imagesを個別に再構築してVecを返す
      let result = self.images
        .iter()
        .map(|img| ImageEntity::new(img.get_id(), img.get_path().to_string()))
        .collect();
      Ok(result)
    }
  }

  #[tokio::test]
  async fn test_execute_success_empty_list() {
    // 空のリポジトリでユースケースを作成
    let repository = Arc::new(MockImageRepository::new());
    let usecase = ViewImagesUseCase::new(repository);

    // execute実行
    let result = usecase.execute().await;

    // 結果検証
    assert!(result.is_ok());
    let image_dtos = result.unwrap();
    assert_eq!(image_dtos.len(), 0);
  }

  #[tokio::test]
  async fn test_execute_success_with_images() {
    // テスト用画像エンティティを作成
    let image1_id = Uuid::new_v4();
    let image1_path = "/images/test1.jpg".to_string();
    let image1 = ImageEntity::new(image1_id, image1_path.clone());

    let image2_id = Uuid::new_v4();
    let image2_path = "/images/test2.jpg".to_string();
    let image2 = ImageEntity::new(image2_id, image2_path.clone());

    // モックリポジトリにテスト画像を設定
    let repository = Arc::new(MockImageRepository::with_images(vec![image1, image2]));
    let usecase = ViewImagesUseCase::new(repository);

    // execute実行
    let result = usecase.execute().await;

    // 結果検証
    assert!(result.is_ok());
    let image_dtos = result.unwrap();
    assert_eq!(image_dtos.len(), 2);

    // 最初の画像を検証
    let dto1 = &image_dtos[0];
    assert_eq!(dto1.id, image1_id);
    assert_eq!(dto1.path, image1_path);

    // 2番目の画像を検証
    let dto2 = &image_dtos[1];
    assert_eq!(dto2.id, image2_id);
    assert_eq!(dto2.path, image2_path);
  }

  #[tokio::test]
  async fn test_execute_repository_error() {
    // エラーを返すモックリポジトリでユースケースを作成
    let repository = Arc::new(MockImageRepository::with_error());
    let usecase = ViewImagesUseCase::new(repository);

    // execute実行
    let result = usecase.execute().await;

    // エラーが返されることを検証
    assert!(result.is_err());
    match result.unwrap_err() {
      ViewImagesError::RetrieveFailed(message) => {
        assert_eq!(message, "テスト用のエラーです");
      }
      other => panic!("期待されるエラータイプではありません: {:?}", other),
    }
  }

  #[tokio::test]
  async fn test_execute_single_image() {
    // 1つの画像でテスト
    let image_id = Uuid::new_v4();
    let image_path = "/images/single.jpg".to_string();
    let image = ImageEntity::new(image_id, image_path.clone());

    let repository = Arc::new(MockImageRepository::with_images(vec![image]));
    let usecase = ViewImagesUseCase::new(repository);

    // execute実行
    let result = usecase.execute().await;

    // 結果検証
    assert!(result.is_ok());
    let image_dtos = result.unwrap();
    assert_eq!(image_dtos.len(), 1);

    let dto = &image_dtos[0];
    assert_eq!(dto.id, image_id);
    assert_eq!(dto.path, image_path);
  }

  #[tokio::test]
  async fn test_usecase_new() {
    // ViewImagesUseCaseの作成をテスト
    let repository = Arc::new(MockImageRepository::new());
    let usecase = ViewImagesUseCase::new(repository);

    // ユースケースが正常に作成されることを確認
    // 実際には内部フィールドにアクセスできないため、executeメソッドが正常に動作することで確認
    let result = usecase.execute().await;
    assert!(result.is_ok());
  }
}
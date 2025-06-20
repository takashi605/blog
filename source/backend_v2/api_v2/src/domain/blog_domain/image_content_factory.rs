use std::sync::Arc;
use uuid::Uuid;
use async_trait::async_trait;

use crate::domain::image_domain::{image_repository::ImageRepository, image_repository::ImageRepositoryError};
use super::blog_post_entity::image_content_entity::ImageContentEntity;

#[derive(Debug, PartialEq)]
pub enum ImageContentFactoryError {
    ImageNotFound(String),
    RepositoryError(String),
}

impl From<ImageRepositoryError> for ImageContentFactoryError {
    fn from(error: ImageRepositoryError) -> Self {
        match error {
            ImageRepositoryError::FindByPathFailed(msg) => ImageContentFactoryError::ImageNotFound(msg),
            _ => ImageContentFactoryError::RepositoryError(format!("Repository error: {:?}", error)),
        }
    }
}

pub struct ImageContentFactory {
    image_repository: Arc<dyn ImageRepository>,
}

impl ImageContentFactory {
    pub fn new(image_repository: Arc<dyn ImageRepository>) -> Self {
        Self { image_repository }
    }

    pub async fn create(&self, path: String) -> Result<ImageContentEntity, ImageContentFactoryError> {
        // path を元にリポジトリから ImageEntity を取得
        let image = self.image_repository.find_by_path(&path).await?;
        
        // 新しい ImageContent の ID を自動生成
        let id = Uuid::new_v4();
        
        // ImageContentEntity を生成
        Ok(ImageContentEntity::new(id, image))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::image_domain::image_entity::ImageEntity;
    use std::collections::HashMap;
    use uuid::Uuid;

    // テスト用のモックリポジトリ
    pub struct MockImageRepository {
        images: HashMap<String, ImageEntity>,
    }

    impl MockImageRepository {
        pub fn new() -> Self {
            Self {
                images: HashMap::new(),
            }
        }

        pub fn add_image(&mut self, path: String, image: ImageEntity) {
            self.images.insert(path, image);
        }
    }

    #[async_trait]
    impl ImageRepository for MockImageRepository {
        async fn find(&self, _id: &str) -> Result<ImageEntity, ImageRepositoryError> {
            // テストでは使用しない
            Err(ImageRepositoryError::FindFailed("not implemented".to_string()))
        }

        async fn find_by_path(&self, path: &str) -> Result<ImageEntity, ImageRepositoryError> {
            match self.images.get(path) {
                Some(image) => Ok(ImageEntity::new(image.get_id(), image.get_path().to_string())),
                None => Err(ImageRepositoryError::FindByPathFailed(format!("Image not found for path: {}", path))),
            }
        }

        async fn save(&self, _image: ImageEntity) -> Result<ImageEntity, ImageRepositoryError> {
            // テストでは使用しない
            Err(ImageRepositoryError::SaveFailed("not implemented".to_string()))
        }

        async fn find_all(&self) -> Result<Vec<ImageEntity>, ImageRepositoryError> {
            // テストでは使用しない
            Err(ImageRepositoryError::FindAllFailed("not implemented".to_string()))
        }
    }

    #[tokio::test]
    async fn can_create_image_content_with_valid_path() {
        let mut mock_repo = MockImageRepository::new();
        let image_id = Uuid::new_v4();
        let image_path = "images/test.jpg".to_string();
        let image = ImageEntity::new(image_id, image_path.clone());
        mock_repo.add_image(image_path.clone(), image);

        let factory = ImageContentFactory::new(Arc::new(mock_repo));

        let result = factory.create(image_path.clone()).await;

        assert!(result.is_ok());
        let image_content = result.unwrap();
        
        // ImageContent の ID は自動生成される
        assert_ne!(image_content.get_id(), Uuid::nil());
        
        // ImageEntity の情報が正しく保持される
        assert_eq!(image_content.get_image().get_id(), image_id);
        assert_eq!(image_content.get_path(), "images/test.jpg");
    }

    #[tokio::test]
    async fn error_occurs_with_nonexistent_path() {
        let mock_repo = MockImageRepository::new();
        let factory = ImageContentFactory::new(Arc::new(mock_repo));

        let result = factory.create("nonexistent/path.jpg".to_string()).await;

        assert!(result.is_err());
        match result.unwrap_err() {
            ImageContentFactoryError::ImageNotFound(msg) => {
                assert!(msg.contains("Image not found for path: nonexistent/path.jpg"));
            }
            _ => panic!("期待されるエラーは ImageNotFound です"),
        }
    }

    #[tokio::test]
    async fn multiple_calls_generate_different_ids() {
        let mut mock_repo = MockImageRepository::new();
        let image_id = Uuid::new_v4();
        let image_path = "images/test.jpg".to_string();
        let image = ImageEntity::new(image_id, image_path.clone());
        mock_repo.add_image(image_path.clone(), image);

        let factory = ImageContentFactory::new(Arc::new(mock_repo));

        let result1 = factory.create(image_path.clone()).await;
        let result2 = factory.create(image_path.clone()).await;

        assert!(result1.is_ok());
        assert!(result2.is_ok());

        let image_content1 = result1.unwrap();
        let image_content2 = result2.unwrap();

        // 同じ Image から作成しても、ImageContent の ID は異なる
        assert_ne!(image_content1.get_id(), image_content2.get_id());
        
        // 元の ImageEntity の ID は同じ
        assert_eq!(image_content1.get_image().get_id(), image_content2.get_image().get_id());
    }

    #[tokio::test]
    async fn factory_generates_correct_id_format() {
        let mut mock_repo = MockImageRepository::new();
        let image_id = Uuid::new_v4();
        let image_path = "images/test.jpg".to_string();
        let image = ImageEntity::new(image_id, image_path.clone());
        mock_repo.add_image(image_path.clone(), image);

        let factory = ImageContentFactory::new(Arc::new(mock_repo));

        let result = factory.create(image_path).await;

        assert!(result.is_ok());
        let image_content = result.unwrap();
        
        // UUID v4 が生成されることを確認
        assert_eq!(image_content.get_id().get_version_num(), 4);
        assert_ne!(image_content.get_id(), Uuid::nil());
    }
}
use async_trait::async_trait;
use super::image_entity::ImageEntity;

#[async_trait]
pub trait ImageRepository: Send + Sync {
    async fn find(&self, id: &str) -> Result<ImageEntity, ImageRepositoryError>;
    async fn find_by_path(&self, path: &str) -> Result<ImageEntity, ImageRepositoryError>;
    async fn save(&self, image: ImageEntity) -> Result<ImageEntity, ImageRepositoryError>;
    async fn find_all(&self) -> Result<Vec<ImageEntity>, ImageRepositoryError>;
}

#[derive(Debug, PartialEq)]
pub enum ImageRepositoryError {
    FindFailed(String),
    FindByPathFailed(String),
    SaveFailed(String),
    FindAllFailed(String),
}
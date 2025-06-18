use async_trait::async_trait;
use super::image_entity::ImageEntity;

#[async_trait]
pub trait ImageRepository {
    async fn save(&self, image: ImageEntity) -> Result<ImageEntity, ImageRepositoryError>;
    async fn find_all(&self) -> Result<Vec<ImageEntity>, ImageRepositoryError>;
}

#[derive(Debug, PartialEq)]
pub enum ImageRepositoryError {
    SaveFailed(String),
    FindAllFailed(String),
}
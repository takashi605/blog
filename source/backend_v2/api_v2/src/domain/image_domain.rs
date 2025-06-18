use uuid::Uuid;
use async_trait::async_trait;

#[derive(Debug, PartialEq)]
pub struct ImageEntity {
    id: Uuid,
    path: String,
}

impl ImageEntity {
    pub fn new(id: Uuid, path: String) -> Self {
        Self { id, path }
    }

    pub fn get_id(&self) -> Uuid {
        self.id
    }

    pub fn get_path(&self) -> &str {
        &self.path
    }
}

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn 画像を作成できる() {
        let id = Uuid::new_v4();
        let path = "images/test.jpg".to_string();
        
        let image = ImageEntity::new(id, path.clone());
        
        assert_eq!(image.get_id(), id);
        assert_eq!(image.get_path(), "images/test.jpg");
    }

    #[test]
    fn 同じIDの画像は等価() {
        let id = Uuid::new_v4();
        let image1 = ImageEntity::new(id, "test.jpg".to_string());
        let image2 = ImageEntity::new(id, "test.jpg".to_string());
        
        assert_eq!(image1, image2);
    }

    #[test]
    fn 異なるIDの画像は等価ではない() {
        let image1 = ImageEntity::new(Uuid::new_v4(), "test.jpg".to_string());
        let image2 = ImageEntity::new(Uuid::new_v4(), "test.jpg".to_string());
        
        assert_ne!(image1, image2);
    }
}
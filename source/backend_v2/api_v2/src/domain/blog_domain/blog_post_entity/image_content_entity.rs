use uuid::Uuid;
use super::content_type::ContentType;
use crate::domain::image_domain::image_entity::ImageEntity;

#[derive(Debug)]
pub struct ImageContentEntity {
    id: Uuid,
    image: ImageEntity,
}

impl ImageContentEntity {
    pub fn new(id: Uuid, image: ImageEntity) -> Self {
        Self { id, image }
    }

    pub fn get_id(&self) -> Uuid {
        self.id
    }

    pub fn get_image(&self) -> &ImageEntity {
        &self.image
    }

    pub fn get_path(&self) -> &str {
        self.image.get_path()
    }

    pub fn get_type(&self) -> ContentType {
        ContentType::Image
    }
}
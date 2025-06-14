use uuid::Uuid;
use super::content_type::ContentType;

#[derive(Debug)]
pub struct ImageContentEntity {
    id: Uuid,
    path: String,
}

impl ImageContentEntity {
    pub fn new(id: Uuid, path: String) -> Self {
        Self { id, path }
    }

    pub fn get_id(&self) -> Uuid {
        self.id
    }

    pub fn get_path(&self) -> &str {
        &self.path
    }

    pub fn get_type(&self) -> ContentType {
        ContentType::Image
    }
}
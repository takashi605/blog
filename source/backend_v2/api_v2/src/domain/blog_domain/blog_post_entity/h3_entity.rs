use uuid::Uuid;
use super::content_type::ContentType;

#[derive(Debug)]
pub struct H3Entity {
    id: Uuid,
    text: String,
}

impl H3Entity {
    pub fn new(id: Uuid, text: String) -> Self {
        Self { id, text }
    }

    pub fn get_id(&self) -> Uuid {
        self.id
    }

    pub fn get_value(&self) -> &str {
        &self.text
    }

    pub fn get_type(&self) -> ContentType {
        ContentType::H3
    }
}
use uuid::Uuid;
use super::content_type::ContentType;

#[derive(Debug)]
pub struct CodeBlockEntity {
    id: Uuid,
    title: String,
    code: String,
    language: String,
}

impl CodeBlockEntity {
    pub fn new(id: Uuid, title: String, code: String, language: String) -> Self {
        Self { id, title, code, language }
    }

    pub fn get_id(&self) -> Uuid {
        self.id
    }

    pub fn get_title(&self) -> &str {
        &self.title
    }

    pub fn get_code(&self) -> &str {
        &self.code
    }

    pub fn get_language(&self) -> &str {
        &self.language
    }

    pub fn get_type(&self) -> ContentType {
        ContentType::CodeBlock
    }
}
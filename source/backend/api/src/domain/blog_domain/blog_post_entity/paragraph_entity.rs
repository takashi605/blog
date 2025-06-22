use uuid::Uuid;
use super::content_type::ContentType;
use super::rich_text_vo::RichTextVO;

#[derive(Debug)]
pub struct ParagraphEntity {
    id: Uuid,
    text: RichTextVO,
}

impl ParagraphEntity {
    pub fn new(id: Uuid, text: RichTextVO) -> Self {
        Self { id, text }
    }

    pub fn get_id(&self) -> Uuid {
        self.id
    }

    pub fn get_value(&self) -> &RichTextVO {
        &self.text
    }

    pub fn get_type(&self) -> ContentType {
        ContentType::Paragraph
    }
}
use super::rich_text_vo::RichTextVO;
use uuid::Uuid;

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
}

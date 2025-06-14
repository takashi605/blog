use uuid::Uuid;
use super::{
    h2_entity::H2Entity,
    h3_entity::H3Entity,
    paragraph_entity::ParagraphEntity,
    image_content_entity::ImageContentEntity,
    code_block_entity::CodeBlockEntity,
    rich_text_vo::RichTextVO,
};

#[derive(Debug)]
pub enum ContentEntity {
    H2(H2Entity),
    H3(H3Entity),
    Paragraph(ParagraphEntity),
    Image(ImageContentEntity),
    CodeBlock(CodeBlockEntity),
}

impl ContentEntity {
    pub fn h2(id: Uuid, text: String) -> Self {
        ContentEntity::H2(H2Entity::new(id, text))
    }

    pub fn h3(id: Uuid, text: String) -> Self {
        ContentEntity::H3(H3Entity::new(id, text))
    }

    pub fn paragraph(id: Uuid, text: RichTextVO) -> Self {
        ContentEntity::Paragraph(ParagraphEntity::new(id, text))
    }

    pub fn image(id: Uuid, path: String) -> Self {
        ContentEntity::Image(ImageContentEntity::new(id, path))
    }

    pub fn code_block(id: Uuid, title: String, code: String, language: String) -> Self {
        ContentEntity::CodeBlock(CodeBlockEntity::new(id, title, code, language))
    }
}
use anyhow::Result;
use chrono::Local;

use super::dto::UpdateBlogPostDTO;
use crate::application::usecase::create_blog_post::dto::CreateContentDTO;
use crate::domain::blog_domain::blog_post_entity::{
  content_entity::ContentEntity,
  image_content_entity::ImageContentEntity,
  rich_text_vo::{RichTextPartVO, RichTextVO},
  BlogPostEntity,
};
use crate::domain::image_domain::ImageEntity;

pub fn convert_dto_to_entity(dto: UpdateBlogPostDTO, entity: &mut BlogPostEntity) -> Result<()> {
  // タイトルの更新
  entity.update_title(dto.title);

  // サムネイルの更新
  entity.set_thumbnail(dto.thumbnail.id, dto.thumbnail.path);

  // 更新日の設定（常に現在日時に更新）
  let today = Local::now().date_naive();
  entity.set_last_update_date(today);

  // 公開日の更新
  entity.set_published_date(dto.published_date);

  // コンテンツの更新
  entity.clear_contents();
  for content_dto in dto.contents {
    let content = convert_content_dto_to_entity(content_dto)?;
    entity.add_content(content);
  }

  Ok(())
}

fn convert_content_dto_to_entity(dto: CreateContentDTO) -> Result<ContentEntity> {
  let content = match dto {
    CreateContentDTO::H2 { id, text } => ContentEntity::h2(id, text),
    CreateContentDTO::H3 { id, text } => ContentEntity::h3(id, text),
    CreateContentDTO::Paragraph { id, text } => {
      let rich_text_parts: Vec<RichTextPartVO> = text
        .into_iter()
        .map(|rich_text_dto| {
          RichTextPartVO::new(
            rich_text_dto.text,
            if rich_text_dto.styles.bold || rich_text_dto.styles.inline_code {
              Some(crate::domain::blog_domain::blog_post_entity::rich_text_vo::RichTextStylesVO {
                bold: rich_text_dto.styles.bold,
                inline_code: rich_text_dto.styles.inline_code,
              })
            } else {
              None
            },
            rich_text_dto.link.map(|link_dto| crate::domain::blog_domain::blog_post_entity::rich_text_vo::LinkVO { url: link_dto.url }),
          )
        })
        .collect();
      ContentEntity::paragraph(id, RichTextVO::new(rich_text_parts))
    }
    CreateContentDTO::Image { id, path } => {
      let image_entity = ImageEntity::new(id, path.clone());
      let image_content = ImageContentEntity::new(id, image_entity);
      ContentEntity::image_from_entity(image_content)
    }
    CreateContentDTO::CodeBlock { id, title, code, language } => ContentEntity::code_block(id, title, code, language),
  };
  Ok(content)
}

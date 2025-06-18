use anyhow::{anyhow, Result};
use common::types::api::{BlogPost, BlogPostContent, CodeBlock, H2Block, H3Block, Image, ImageBlock, Link, ParagraphBlock, RichText, Style};
use uuid::Uuid;

use crate::application::usecase::view_blog_post::dto::{
  ViewBlogPostCodeBlockDTO, ViewBlogPostContentDTO, ViewBlogPostDTO, ViewBlogPostH2BlockDTO, ViewBlogPostH3BlockDTO, ViewBlogPostImageBlockDTO,
  ViewBlogPostImageDTO, ViewBlogPostLinkDTO, ViewBlogPostParagraphBlockDTO, ViewBlogPostRichTextDTO, ViewBlogPostStyleDTO,
};

/// ViewBlogPostDTOをAPIレスポンス用のBlogPostに変換
pub fn view_blog_post_dto_to_response(dto: ViewBlogPostDTO) -> Result<BlogPost> {
  let id = Uuid::parse_str(&dto.id).map_err(|_| anyhow!("DTOのIDをUUIDに変換できませんでした: {}", dto.id))?;

  Ok(BlogPost {
    id,
    title: dto.title,
    thumbnail: convert_image_dto_to_api(dto.thumbnail),
    post_date: dto.post_date,
    last_update_date: dto.last_update_date,
    contents: convert_contents_dto_to_api(dto.contents),
  })
}

/// ViewBlogPostImageDTOをAPI型のImageに変換
fn convert_image_dto_to_api(dto: ViewBlogPostImageDTO) -> Image {
  Image { id: dto.id, path: dto.path }
}

/// ViewBlogPostContentDTOのVecをAPI型のBlogPostContentのVecに変換
fn convert_contents_dto_to_api(dto_contents: Vec<ViewBlogPostContentDTO>) -> Vec<BlogPostContent> {
  dto_contents.into_iter().map(convert_content_dto_to_api).collect()
}

/// ViewBlogPostContentDTOをAPI型のBlogPostContentに変換
fn convert_content_dto_to_api(dto: ViewBlogPostContentDTO) -> BlogPostContent {
  match dto {
    ViewBlogPostContentDTO::H2(h2) => BlogPostContent::H2(convert_h2_dto_to_api(h2)),
    ViewBlogPostContentDTO::H3(h3) => BlogPostContent::H3(convert_h3_dto_to_api(h3)),
    ViewBlogPostContentDTO::Paragraph(para) => BlogPostContent::Paragraph(convert_paragraph_dto_to_api(para)),
    ViewBlogPostContentDTO::Image(img) => BlogPostContent::Image(convert_image_block_dto_to_api(img)),
    ViewBlogPostContentDTO::Code(code) => BlogPostContent::Code(convert_code_block_dto_to_api(code)),
  }
}

/// ViewBlogPostH2BlockDTOをAPI型のH2Blockに変換
fn convert_h2_dto_to_api(dto: ViewBlogPostH2BlockDTO) -> H2Block {
  H2Block { id: dto.id, text: dto.text }
}

/// ViewBlogPostH3BlockDTOをAPI型のH3Blockに変換
fn convert_h3_dto_to_api(dto: ViewBlogPostH3BlockDTO) -> H3Block {
  H3Block { id: dto.id, text: dto.text }
}

/// ViewBlogPostParagraphBlockDTOをAPI型のParagraphBlockに変換
fn convert_paragraph_dto_to_api(dto: ViewBlogPostParagraphBlockDTO) -> ParagraphBlock {
  ParagraphBlock {
    id: dto.id,
    text: dto.text.into_iter().map(convert_rich_text_dto_to_api).collect(),
  }
}

/// ViewBlogPostRichTextDTOをAPI型のRichTextに変換
fn convert_rich_text_dto_to_api(dto: ViewBlogPostRichTextDTO) -> RichText {
  RichText {
    text: dto.text,
    styles: convert_style_dto_to_api(dto.styles),
    link: dto.link.map(convert_link_dto_to_api),
  }
}

/// ViewBlogPostStyleDTOをAPI型のStyleに変換
fn convert_style_dto_to_api(dto: ViewBlogPostStyleDTO) -> Style {
  Style {
    bold: dto.bold,
    inline_code: dto.inline_code,
  }
}

/// ViewBlogPostLinkDTOをAPI型のLinkに変換
fn convert_link_dto_to_api(dto: ViewBlogPostLinkDTO) -> Link {
  Link { url: dto.url }
}

/// ViewBlogPostImageBlockDTOをAPI型のImageBlockに変換
fn convert_image_block_dto_to_api(dto: ViewBlogPostImageBlockDTO) -> ImageBlock {
  ImageBlock { id: dto.id, path: dto.path }
}

/// ViewBlogPostCodeBlockDTOをAPI型のCodeBlockに変換
fn convert_code_block_dto_to_api(dto: ViewBlogPostCodeBlockDTO) -> CodeBlock {
  CodeBlock {
    id: dto.id,
    title: dto.title,
    code: dto.code,
    language: dto.language,
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use chrono::{NaiveDate, Utc};
  use uuid::Uuid;

  #[test]
  fn test_view_blog_post_dto_to_response_success() {
    let test_h2_id = Uuid::new_v4();
    let test_thumbnail_id = Uuid::new_v4();

    let dto = ViewBlogPostDTO {
      id: "550e8400-e29b-41d4-a716-446655440000".to_string(),
      title: "テスト記事".to_string(),
      thumbnail: ViewBlogPostImageDTO {
        id: test_thumbnail_id,
        path: "/test/image.jpg".to_string(),
      },
      post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
      last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
      contents: vec![ViewBlogPostContentDTO::H2(ViewBlogPostH2BlockDTO {
        id: test_h2_id,
        text: "見出し".to_string(),
      })],
      published_date: Utc::now(),
      is_public: true,
    };

    let result = view_blog_post_dto_to_response(dto.clone()).unwrap();

    assert_eq!(result.id.to_string(), "550e8400-e29b-41d4-a716-446655440000");
    assert_eq!(result.title, dto.title);
    assert_eq!(result.thumbnail.id, test_thumbnail_id);
    assert_eq!(result.thumbnail.path, "/test/image.jpg");
    assert_eq!(result.post_date, dto.post_date);
    assert_eq!(result.last_update_date, dto.last_update_date);
    assert_eq!(result.contents.len(), 1);

    // コンテンツの変換検証
    match &result.contents[0] {
      BlogPostContent::H2(h2_block) => {
        assert_eq!(h2_block.id, test_h2_id);
        assert_eq!(h2_block.text, "見出し");
      }
      _ => panic!("Expected H2 content in result"),
    }
  }

  #[test]
  fn test_view_blog_post_dto_to_response_invalid_uuid() {
    let dto = ViewBlogPostDTO {
      id: "invalid-uuid".to_string(),
      title: "テスト記事".to_string(),
      thumbnail: ViewBlogPostImageDTO {
        id: Uuid::new_v4(),
        path: "/test/image.jpg".to_string(),
      },
      post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
      last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
      contents: vec![],
      published_date: Utc::now(),
      is_public: true,
    };

    let result = view_blog_post_dto_to_response(dto);
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("DTOのIDをUUIDに変換できませんでした"));
  }
}

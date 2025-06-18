use chrono::NaiveDate;
use uuid::Uuid;

// DTOの定義（APIリクエストから受け取るデータ構造）

#[derive(Debug, Clone)]
pub struct CreateBlogPostDTO {
  pub title: String,
  pub thumbnail: CreateImageDTO,
  pub post_date: Option<NaiveDate>,
  pub contents: Vec<CreateContentDTO>,
}

#[derive(Debug, Clone)]
pub struct CreateImageDTO {
  pub id: Uuid,
  pub path: String,
}

#[derive(Debug, Clone)]
pub enum CreateContentDTO {
  H2 { id: Uuid, text: String },
  H3 { id: Uuid, text: String },
  Paragraph { id: Uuid, text: Vec<CreateRichTextDTO> },
  Image { id: Uuid, path: String },
  CodeBlock { id: Uuid, title: String, code: String, language: String },
}

#[derive(Debug, Clone)]
pub struct CreateRichTextDTO {
  pub text: String,
  pub styles: CreateStyleDTO,
  pub link: Option<CreateLinkDTO>,
}

#[derive(Debug, Clone)]
pub struct CreateStyleDTO {
  pub bold: bool,
  pub inline_code: bool,
}

#[derive(Debug, Clone)]
pub struct CreateLinkDTO {
  pub url: String,
}

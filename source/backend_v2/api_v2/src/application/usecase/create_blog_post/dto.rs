use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// DTOの定義（APIリクエストから受け取るデータ構造）

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateBlogPostDTO {
  pub title: String,
  pub thumbnail: CreateImageDTO,
  pub post_date: Option<NaiveDate>,
  pub contents: Vec<CreateContentDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateImageDTO {
  pub id: Uuid,
  pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum CreateContentDTO {
  #[serde(rename = "h2")]
  H2 { id: Uuid, text: String },
  #[serde(rename = "h3")]
  H3 { id: Uuid, text: String },
  #[serde(rename = "paragraph")]
  Paragraph { id: Uuid, text: Vec<CreateRichTextDTO> },
  #[serde(rename = "image")]
  Image { id: Uuid, path: String },
  #[serde(rename = "code-block")]
  CodeBlock { id: Uuid, title: String, code: String, language: String },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateRichTextDTO {
  pub text: String,
  pub styles: CreateStyleDTO,
  pub link: Option<CreateLinkDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateStyleDTO {
  pub bold: bool,
  #[serde(rename = "inline-code")]
  pub inline_code: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateLinkDTO {
  pub url: String,
}

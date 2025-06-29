use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

// TODO 各 Clone を削除する
#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct BlogPost {
  pub id: Uuid,
  pub title: String,
  pub thumbnail: Image,
  pub post_date: NaiveDate,
  pub last_update_date: NaiveDate,
  pub published_date: NaiveDate,
  pub contents: Vec<BlogPostContent>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct Image {
  pub id: Uuid,
  pub path: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct Style {
  pub bold: bool,
  pub inline_code: bool,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct Link {
  pub url: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum BlogPostContent {
  #[serde(rename = "h2")]
  H2(H2Block),
  #[serde(rename = "h3")]
  H3(H3Block),
  #[serde(rename = "paragraph")]
  Paragraph(ParagraphBlock),
  #[serde(rename = "image")]
  Image(ImageBlock),
  #[serde(rename = "codeBlock")]
  Code(CodeBlock),
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct H2Block {
  pub id: Uuid,
  pub text: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct H3Block {
  pub id: Uuid,
  pub text: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ParagraphBlock {
  pub id: Uuid,
  pub text: Vec<RichText>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct RichText {
  pub text: String,
  pub styles: Style,
  pub link: Option<Link>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ImageBlock {
  pub id: Uuid,
  pub path: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CodeBlock {
  pub id: Uuid,
  pub title: String,
  pub code: String,
  pub language: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
pub struct ErrResponse {
  pub message: String,
}

// リクエスト用の型（IDを含まない）
#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateBlogPostRequest {
  pub title: String,
  pub thumbnail: CreateImageContentRequest,
  pub post_date: NaiveDate,
  pub last_update_date: NaiveDate,
  pub published_date: NaiveDate,
  pub contents: Vec<CreateBlogPostContentRequest>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateImageRequest {
  pub path: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateImageContentRequest {
  pub id: Option<Uuid>,
  pub path: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum CreateBlogPostContentRequest {
  #[serde(rename = "h2")]
  H2(CreateH2BlockRequest),
  #[serde(rename = "h3")]
  H3(CreateH3BlockRequest),
  #[serde(rename = "paragraph")]
  Paragraph(CreateParagraphBlockRequest),
  #[serde(rename = "image")]
  Image(CreateImageBlockRequest),
  #[serde(rename = "codeBlock")]
  Code(CreateCodeBlockRequest),
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateH2BlockRequest {
  pub text: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateH3BlockRequest {
  pub text: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateParagraphBlockRequest {
  pub text: Vec<RichText>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateImageBlockRequest {
  pub path: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateCodeBlockRequest {
  pub title: String,
  pub code: String,
  pub language: String,
}

// 更新用のリクエスト型（post_dateとlast_update_dateは含まない）
#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateBlogPostRequest {
  pub title: String,
  pub thumbnail: Image,
  pub published_date: NaiveDate,
  pub contents: Vec<BlogPostContent>,
}

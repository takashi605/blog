use chrono::NaiveDate;
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq)]
pub struct BlogPostDTO {
  pub id: String,
  pub title: String,
  pub thumbnail: ImageDTO,
  pub post_date: NaiveDate,
  pub last_update_date: NaiveDate,
  pub contents: Vec<BlogPostContentDTO>,
  pub published_date: NaiveDate,
  pub is_public: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub enum BlogPostContentDTO {
  H2(BlogPostH2BlockDTO),
  H3(BlogPostH3BlockDTO),
  Paragraph(BlogPostParagraphBlockDTO),
  Image(BlogPostImageBlockDTO),
  Code(BlogPostCodeBlockDTO),
}

#[derive(Debug, Clone, PartialEq)]
pub struct BlogPostH2BlockDTO {
  pub id: Uuid,
  pub text: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct BlogPostH3BlockDTO {
  pub id: Uuid,
  pub text: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct BlogPostParagraphBlockDTO {
  pub id: Uuid,
  pub text: Vec<BlogPostRichTextDTO>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct BlogPostRichTextDTO {
  pub text: String,
  pub styles: BlogPostStyleDTO,
  pub link: Option<BlogPostLinkDTO>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct BlogPostStyleDTO {
  pub bold: bool,
  pub inline_code: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub struct BlogPostLinkDTO {
  pub url: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct BlogPostImageBlockDTO {
  pub id: Uuid,
  pub path: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct BlogPostCodeBlockDTO {
  pub id: Uuid,
  pub title: String,
  pub code: String,
  pub language: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ImageDTO {
  pub id: Uuid,
  pub path: String,
}

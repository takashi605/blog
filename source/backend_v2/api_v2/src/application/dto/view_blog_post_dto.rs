use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ViewBlogPostDTO {
  pub id: String,
  pub title: String,
  pub content: ViewBlogPostContentDTO,
  pub published_date: DateTime<Utc>,
  pub is_public: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ViewBlogPostContentDTO {
  pub paragraphs: Vec<ViewBlogPostParagraphDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ViewBlogPostParagraphDTO {
  pub id: String,
  pub text: ViewBlogPostRichTextDTO,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ViewBlogPostRichTextDTO {
  pub content: String,
  pub styles: Vec<ViewBlogPostTextStyleDTO>,
  pub links: Vec<ViewBlogPostLinkDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ViewBlogPostTextStyleDTO {
  pub start: usize,
  pub end: usize,
  pub style_type: ViewBlogPostStyleTypeDTO,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ViewBlogPostStyleTypeDTO {
  Bold,
  Italic,
  Code,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ViewBlogPostLinkDTO {
  pub start: usize,
  pub end: usize,
  pub url: String,
}

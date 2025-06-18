use chrono::{DateTime, NaiveDate, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostDTO {
    pub id: String,
    pub title: String,
    pub thumbnail: ViewBlogPostImageDTO,
    pub post_date: NaiveDate,
    pub last_update_date: NaiveDate,
    pub contents: Vec<ViewBlogPostContentDTO>,
    pub published_date: DateTime<Utc>,
    pub is_public: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostImageDTO {
    pub id: Uuid,
    pub path: String,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ViewBlogPostContentDTO {
    H2(ViewBlogPostH2BlockDTO),
    H3(ViewBlogPostH3BlockDTO),
    Paragraph(ViewBlogPostParagraphBlockDTO),
    Image(ViewBlogPostImageBlockDTO),
    Code(ViewBlogPostCodeBlockDTO),
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostH2BlockDTO {
    pub id: Uuid,
    pub text: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostH3BlockDTO {
    pub id: Uuid,
    pub text: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostParagraphBlockDTO {
    pub id: Uuid,
    pub text: Vec<ViewBlogPostRichTextDTO>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostRichTextDTO {
    pub text: String,
    pub styles: ViewBlogPostStyleDTO,
    pub link: Option<ViewBlogPostLinkDTO>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostStyleDTO {
    pub bold: bool,
    pub inline_code: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostLinkDTO {
    pub url: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostImageBlockDTO {
    pub id: Uuid,
    pub path: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewBlogPostCodeBlockDTO {
    pub id: Uuid,
    pub title: String,
    pub code: String,
    pub language: String,
}
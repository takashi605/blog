use chrono::{DateTime, NaiveDate, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostsDTO {
    pub blog_posts: Vec<ViewLatestBlogPostItemDTO>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostItemDTO {
    pub id: String,
    pub title: String,
    pub thumbnail: ViewLatestBlogPostImageDTO,
    pub post_date: NaiveDate,
    pub last_update_date: NaiveDate,
    pub contents: Vec<ViewLatestBlogPostContentDTO>,
    pub published_date: DateTime<Utc>,
    pub is_public: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostImageDTO {
    pub id: Uuid,
    pub path: String,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ViewLatestBlogPostContentDTO {
    H2(ViewLatestBlogPostH2BlockDTO),
    H3(ViewLatestBlogPostH3BlockDTO),
    Paragraph(ViewLatestBlogPostParagraphBlockDTO),
    Image(ViewLatestBlogPostImageBlockDTO),
    Code(ViewLatestBlogPostCodeBlockDTO),
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostH2BlockDTO {
    pub id: Uuid,
    pub text: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostH3BlockDTO {
    pub id: Uuid,
    pub text: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostParagraphBlockDTO {
    pub id: Uuid,
    pub text: Vec<ViewLatestBlogPostRichTextDTO>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostRichTextDTO {
    pub text: String,
    pub styles: ViewLatestBlogPostStyleDTO,
    pub link: Option<ViewLatestBlogPostLinkDTO>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostStyleDTO {
    pub bold: bool,
    pub inline_code: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostLinkDTO {
    pub url: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostImageBlockDTO {
    pub id: Uuid,
    pub path: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ViewLatestBlogPostCodeBlockDTO {
    pub id: Uuid,
    pub title: String,
    pub code: String,
    pub language: String,
}
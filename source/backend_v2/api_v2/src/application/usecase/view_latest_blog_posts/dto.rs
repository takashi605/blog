use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ViewLatestBlogPostsDTO {
    pub blog_posts: Vec<ViewLatestBlogPostItemDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewLatestBlogPostImageDTO {
    pub id: Uuid,
    pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ViewLatestBlogPostContentDTO {
    #[serde(rename = "h2")]
    H2(ViewLatestBlogPostH2BlockDTO),
    #[serde(rename = "h3")]
    H3(ViewLatestBlogPostH3BlockDTO),
    #[serde(rename = "paragraph")]
    Paragraph(ViewLatestBlogPostParagraphBlockDTO),
    #[serde(rename = "image")]
    Image(ViewLatestBlogPostImageBlockDTO),
    #[serde(rename = "codeBlock")]
    Code(ViewLatestBlogPostCodeBlockDTO),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewLatestBlogPostH2BlockDTO {
    pub id: Uuid,
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewLatestBlogPostH3BlockDTO {
    pub id: Uuid,
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewLatestBlogPostParagraphBlockDTO {
    pub id: Uuid,
    pub text: Vec<ViewLatestBlogPostRichTextDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewLatestBlogPostRichTextDTO {
    pub text: String,
    pub styles: ViewLatestBlogPostStyleDTO,
    pub link: Option<ViewLatestBlogPostLinkDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewLatestBlogPostStyleDTO {
    pub bold: bool,
    pub inline_code: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewLatestBlogPostLinkDTO {
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewLatestBlogPostImageBlockDTO {
    pub id: Uuid,
    pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewLatestBlogPostCodeBlockDTO {
    pub id: Uuid,
    pub title: String,
    pub code: String,
    pub language: String,
}
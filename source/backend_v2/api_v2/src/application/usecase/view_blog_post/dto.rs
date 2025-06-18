use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewBlogPostImageDTO {
    pub id: Uuid,
    pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ViewBlogPostContentDTO {
    #[serde(rename = "h2")]
    H2(ViewBlogPostH2BlockDTO),
    #[serde(rename = "h3")]
    H3(ViewBlogPostH3BlockDTO),
    #[serde(rename = "paragraph")]
    Paragraph(ViewBlogPostParagraphBlockDTO),
    #[serde(rename = "image")]
    Image(ViewBlogPostImageBlockDTO),
    #[serde(rename = "codeBlock")]
    Code(ViewBlogPostCodeBlockDTO),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewBlogPostH2BlockDTO {
    pub id: Uuid,
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewBlogPostH3BlockDTO {
    pub id: Uuid,
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewBlogPostParagraphBlockDTO {
    pub id: Uuid,
    pub text: Vec<ViewBlogPostRichTextDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewBlogPostRichTextDTO {
    pub text: String,
    pub styles: ViewBlogPostStyleDTO,
    pub link: Option<ViewBlogPostLinkDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewBlogPostStyleDTO {
    pub bold: bool,
    pub inline_code: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewBlogPostLinkDTO {
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewBlogPostImageBlockDTO {
    pub id: Uuid,
    pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ViewBlogPostCodeBlockDTO {
    pub id: Uuid,
    pub title: String,
    pub code: String,
    pub language: String,
}
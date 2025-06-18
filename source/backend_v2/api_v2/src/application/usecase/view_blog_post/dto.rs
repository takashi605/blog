use chrono::{DateTime, NaiveDate, Utc};
use common::types::api::{BlogPostContent, Image};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ViewBlogPostDTO {
    pub id: String,
    pub title: String,
    pub thumbnail: Image,
    pub post_date: NaiveDate,
    pub last_update_date: NaiveDate,
    pub contents: Vec<BlogPostContent>,
    pub published_date: DateTime<Utc>,
    pub is_public: bool,
}
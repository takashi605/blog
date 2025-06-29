use chrono::NaiveDate;

use crate::application::usecase::create_blog_post::dto::{CreateContentDTO, CreateImageDTO};

#[derive(Debug, Clone)]
pub struct UpdateBlogPostDTO {
  pub title: String,
  pub thumbnail: CreateImageDTO,
  pub published_date: NaiveDate,
  pub contents: Vec<CreateContentDTO>,
}

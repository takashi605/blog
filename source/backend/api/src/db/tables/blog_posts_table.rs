use crate::db::pool::POOL;
use anyhow::Result;
use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct BlogPostTable {
  pub id: Uuid,
  title: String,
  thumbnail_image_id: Uuid,
  post_date: chrono::NaiveDate,
  last_update_date: chrono::NaiveDate,
  published_at: DateTime<Utc>,
  created_at: DateTime<Utc>,
  updated_at: DateTime<Utc>,
}

pub async fn fetch_blog_post_by_id(id: Uuid) -> Result<BlogPostTable> {
  let post = sqlx::query_as::<_, BlogPostTable>(
    "select id, title, thumbnail_image_id, post_date, last_update_date, published_at, created_at, updated_at from blog_posts where id = $1",
  )
  .bind(id)
  .fetch_one(&*POOL)
  .await?;
  Ok(post)
}

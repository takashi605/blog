use crate::db::pool::POOL;
use anyhow::Result;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct BlogPostRecord {
  pub id: Uuid,
  pub title: String,
  pub thumbnail_image_id: Uuid,
  pub post_date: chrono::NaiveDate,
  pub last_update_date: chrono::NaiveDate,
}

pub async fn fetch_blog_post_by_id(id: Uuid) -> Result<BlogPostRecord> {
  let post = sqlx::query_as::<_, BlogPostRecord>(
    "select id, title, thumbnail_image_id, post_date, last_update_date from blog_posts where id = $1",
  )
  .bind(id)
  .fetch_one(&*POOL)
  .await?;
  Ok(post)
}

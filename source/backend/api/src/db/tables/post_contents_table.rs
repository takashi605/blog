use sqlx::FromRow;
use uuid::Uuid;
use anyhow::Result;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct PostContentRecord {
  pub id: Uuid,
  pub content_type: String,
  pub sort_order: i32,
}

pub async fn fetch_post_contents_by_post_id(post_id: Uuid) -> Result<Vec<PostContentRecord>> {
  let contents = sqlx::query_as::<_, PostContentRecord>("select id, content_type, sort_order from post_contents where post_id = $1")
    .bind(post_id)
    .fetch_all(&*POOL)
    .await?;
  Ok(contents)
}

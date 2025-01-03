use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::FromRow;
use anyhow::Result;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct ImageTable {
    pub id: Uuid,
    pub file_name: String,
    pub file_path: Option<String>,
    pub caption: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub async fn fetch_image_by_id(id: Uuid) -> Result<ImageTable> {
  let image = sqlx::query_as::<_, ImageTable>(
    "select id, file_name, file_path, caption, created_at, updated_at from images where id = $1",
  )
  .bind(id)
  .fetch_one(&*POOL)
  .await?;
  Ok(image)
}

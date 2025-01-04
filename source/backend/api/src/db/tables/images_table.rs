use uuid::Uuid;
use sqlx::FromRow;
use anyhow::Result;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct ImageRecord {
    pub file_path: String,
}

pub async fn fetch_image_by_id(id: Uuid) -> Result<ImageRecord> {
  let image = sqlx::query_as::<_, ImageRecord>(
    "select file_path from images where id = $1",
  )
  .bind(id)
  .fetch_one(&*POOL)
  .await?;
  Ok(image)
}

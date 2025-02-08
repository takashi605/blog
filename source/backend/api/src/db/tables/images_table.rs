use anyhow::Result;
use sqlx::FromRow;
use uuid::Uuid;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct ImageRecord {
  pub id: Uuid,
  pub file_path: String,
}

pub async fn fetch_image_by_id(id: Uuid) -> Result<ImageRecord> {
  let image = sqlx::query_as::<_, ImageRecord>("select id,file_path from images where id = $1").bind(id).fetch_one(&*POOL).await?;
  Ok(image)
}

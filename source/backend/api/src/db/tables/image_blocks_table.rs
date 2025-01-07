use uuid::Uuid;
use sqlx::FromRow;
use anyhow::Result;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct ImageBlockRecord {
    pub id: Uuid,
    pub image_id: Uuid,
}

pub async fn fetch_image_blocks_by_content_id(content_id: Uuid) -> Result<ImageBlockRecord> {
  let block = sqlx::query_as::<_, ImageBlockRecord>("select id, image_id from image_blocks where content_id = $1")
    .bind(content_id)
    .fetch_one(&*POOL)
    .await?;
  Ok(block)
}

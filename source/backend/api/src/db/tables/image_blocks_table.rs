use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::FromRow;
use anyhow::Result;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct ImageBlockRecord {
    pub id: Uuid,
    pub content_id: Uuid,
    pub image_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub async fn fetch_image_blocks_by_content_id(content_id: Uuid) -> Result<Vec<ImageBlockRecord>> {
  let blocks = sqlx::query_as::<_, ImageBlockRecord>("select id, content_id, image_id, created_at, updated_at from image_blocks where content_id = $1")
    .bind(content_id)
    .fetch_all(&*POOL)
    .await?;
  Ok(blocks)
}

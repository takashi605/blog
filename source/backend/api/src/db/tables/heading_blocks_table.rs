use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::FromRow;
use anyhow::Result;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct HeadingBlockRecord {
    pub id: Uuid,
    pub content_id: Uuid,
    pub heading_level: i16,
    pub text_content: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// TODO Vec で変える必要がないので修正する
pub async fn fetch_heading_blocks_by_content_id(content_id: Uuid) -> Result<Vec<HeadingBlockRecord>> {
  let blocks = sqlx::query_as::<_, HeadingBlockRecord>("select id, content_id, heading_level, text_content, created_at, updated_at from heading_blocks where content_id = $1")
    .bind(content_id)
    .fetch_all(&*POOL)
    .await?;
  Ok(blocks)
}

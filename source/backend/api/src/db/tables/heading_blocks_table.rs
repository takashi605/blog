use uuid::Uuid;
use sqlx::FromRow;
use anyhow::Result;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct HeadingBlockRecord {
    pub id: Uuid,
    pub heading_level: i16,
    pub text_content: String,
}

pub async fn fetch_heading_blocks_by_content_id(content_id: Uuid) -> Result<HeadingBlockRecord> {
  let block = sqlx::query_as::<_, HeadingBlockRecord>("select id, heading_level, text_content from heading_blocks where id = $1")
    .bind(content_id)
    .fetch_one(&*POOL)
    .await?;
  Ok(block)
}

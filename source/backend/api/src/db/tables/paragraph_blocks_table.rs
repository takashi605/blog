use anyhow::Result;
use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct ParagraphBlockRecord {
  pub id: Uuid,
  pub content_id: Uuid,
  pub text_content: String,
  pub created_at: DateTime<Utc>,
  pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow)]
pub struct TextStyleRecord {
  pub id: Uuid,
  pub style_type: String,
  pub created_at: DateTime<Utc>,
  pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow)]
pub struct ParagraphBlockStyleRecord {
  pub style_id: Uuid,
  pub text_block_id: Uuid,
  pub created_at: DateTime<Utc>,
  pub updated_at: DateTime<Utc>,
}

pub async fn fetch_paragraph_blocks_by_content_id(content_id: Uuid) -> Result<Vec<ParagraphBlockRecord>> {
  let blocks =
    sqlx::query_as::<_, ParagraphBlockRecord>("select id, content_id, text_content, created_at, updated_at from paragraph_blocks where content_id = $1")
      .bind(content_id)
      .fetch_all(&*POOL)
      .await?;
  Ok(blocks)
}

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

pub async fn fetch_paragraph_block_by_content_id(content_id: Uuid) -> Result<ParagraphBlockRecord> {
  let block =
    sqlx::query_as::<_, ParagraphBlockRecord>("select id, content_id, text_content, created_at, updated_at from paragraph_blocks where content_id = $1")
      .bind(content_id)
      .fetch_one(&*POOL)
      .await?;
  Ok(block)
}

// paragraph_block_styles 中間テーブルを使って、特定の paragraph_blocks に対応する style を取得する
pub async fn fetch_styles_by_paragraph_block_id(paragraph_block_id: Uuid) -> Result<Vec<TextStyleRecord>> {
  let styles = sqlx::query_as::<_, TextStyleRecord>(
    "select id, style_type, created_at, updated_at from text_styles where id in (select style_id from paragraph_block_styles where text_block_id = $1)",
  )
  .bind(paragraph_block_id)
  .fetch_all(&*POOL)
  .await?;
  Ok(styles)
}

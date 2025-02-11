use anyhow::Result;
use sqlx::FromRow;
use uuid::Uuid;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct ParagraphBlockRecord {
  pub id: Uuid,
}

#[derive(Debug, FromRow)]
pub struct RichTextRecord {
  pub id: Uuid,
  pub text_content: String,
}

#[derive(Debug, FromRow)]
pub struct RichTextStyles {
  pub style_id: Uuid,
  pub rich_text_id: String,
}

#[derive(Debug, FromRow)]
pub struct TextStyleRecord {
  pub style_type: String,
}

pub async fn fetch_paragraph_block_by_content_id(content_id: Uuid) -> Result<ParagraphBlockRecord> {
  let block = sqlx::query_as::<_, ParagraphBlockRecord>("select id from paragraph_blocks where id = $1")
    .bind(content_id)
    .fetch_one(&*POOL)
    .await?;
  Ok(block)
}

// rich_texts を取得
pub async fn fetch_rich_texts_by_paragraph(paragraph_block_id: Uuid) -> Result<Vec<RichTextRecord>> {
  let texts = sqlx::query_as::<_, RichTextRecord>("select id, text_content from rich_texts where paragraph_block_id = $1")
    .bind(paragraph_block_id)
    .fetch_all(&*POOL)
    .await?;
  Ok(texts)
}

// rich_text_styles 中間テーブルを使って、特定の rich_texts に対応する style を取得する
pub async fn fetch_styles_by_rich_text_id(rich_text_id: Uuid) -> Result<Vec<TextStyleRecord>> {
  let styles = sqlx::query_as::<_, TextStyleRecord>(
    "select style_type from text_styles where id in (select style_id from rich_text_styles where rich_text_id = $1)",
  )
  .bind(rich_text_id)
  .fetch_all(&*POOL)
  .await?;
  Ok(styles)
}

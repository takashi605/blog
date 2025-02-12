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
  pub paragraph_block_id: Uuid,
  pub text_content: String,
}

#[derive(Debug, FromRow)]
pub struct RichTextStyleRecord {
  pub style_id: Uuid,
  pub rich_text_id: Uuid,
}

#[derive(Debug, FromRow)]
pub struct TextStyleRecord {
  pub id: Uuid,
  pub style_type: String,
}

pub async fn fetch_paragraph_block_by_content_id(content_id: Uuid) -> Result<ParagraphBlockRecord> {
  let block = sqlx::query_as::<_, ParagraphBlockRecord>("select id from paragraph_blocks where id = $1").bind(content_id).fetch_one(&*POOL).await?;
  Ok(block)
}

// rich_texts を取得
pub async fn fetch_rich_texts_by_paragraph(paragraph_block_id: Uuid) -> Result<Vec<RichTextRecord>> {
  let texts = sqlx::query_as::<_, RichTextRecord>("select id, paragraph_block_id, text_content from rich_texts where paragraph_block_id = $1")
    .bind(paragraph_block_id)
    .fetch_all(&*POOL)
    .await?;
  Ok(texts)
}

// rich_text_styles 中間テーブルを使って、特定の rich_texts に対応する style を取得する
pub async fn fetch_styles_by_rich_text_id(rich_text_id: Uuid) -> Result<Vec<TextStyleRecord>> {
  let styles =
    sqlx::query_as::<_, TextStyleRecord>("select id, style_type from text_styles where id in (select style_id from rich_text_styles where rich_text_id = $1)")
      .bind(rich_text_id)
      .fetch_all(&*POOL)
      .await?;
  Ok(styles)
}

pub async fn fetch_text_styles_all() -> Result<Vec<TextStyleRecord>> {
  let styles = sqlx::query_as::<_, TextStyleRecord>("select id, style_type from text_styles").fetch_all(&*POOL).await?;
  Ok(styles)
}

pub async fn insert_paragraph_block(paragraph_block: ParagraphBlockRecord) -> Result<()> {
  sqlx::query("insert into paragraph_blocks (id) values ($1)").bind(paragraph_block.id).execute(&*POOL).await?;
  Ok(())
}

pub async fn insert_rich_text(rich_text: RichTextRecord) -> Result<()> {
  sqlx::query("insert into rich_texts (id, paragraph_block_id, text_content) values ($1, $2, $3)")
    .bind(rich_text.id)
    .bind(rich_text.paragraph_block_id)
    .bind(rich_text.text_content)
    .execute(&*POOL)
    .await?;
  Ok(())
}

pub async fn insert_rich_text_style(style: RichTextStyleRecord) -> Result<()> {
  sqlx::query("insert into rich_text_styles (style_id, rich_text_id) values ($1, $2)")
    .bind(style.style_id)
    .bind(style.rich_text_id)
    .execute(&*POOL)
    .await?;
  Ok(())
}

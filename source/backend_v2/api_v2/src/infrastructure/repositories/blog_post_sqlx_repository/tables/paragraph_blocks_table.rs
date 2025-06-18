use anyhow::Result;
use sqlx::{Executor, FromRow, Postgres};
use uuid::Uuid;

/*
 * ParagraphBlockRecord とそれに紐づく Record の関連を含めた構造体
 */
#[derive(Debug, FromRow)]
pub struct ParagraphBlockRecordWithRelations {
  pub paragraph_block: ParagraphBlockRecord,
  pub rich_text_records_with_relations: Vec<RichTextRecordWithRelations>,
}

#[derive(Debug, FromRow)]
pub struct RichTextRecordWithRelations {
  pub text_record: RichTextRecord,
  pub style_records: Vec<TextStyleRecord>,
  pub link_record: Option<RichTextLinkRecord>,
}

/*
 * DB内の各テーブル構造に紐づく構造体正義
 */
#[derive(Debug, FromRow)]
pub struct ParagraphBlockRecord {
  pub id: Uuid,
}

#[derive(Debug, FromRow)]
pub struct RichTextRecord {
  pub id: Uuid,
  pub paragraph_block_id: Uuid,
  pub text_content: String,
  pub sort_order: i32,
}

#[derive(Debug, FromRow)]
pub struct RichTextStyleRecord {
  pub style_id: Uuid,
  pub rich_text_id: Uuid,
}

#[derive(Debug, Clone, FromRow)]
pub struct TextStyleRecord {
  pub id: Uuid,
  pub style_type: String,
}

#[derive(Debug, FromRow)]
pub struct RichTextLinkRecord {
  pub id: Uuid,
  pub rich_text_id: Uuid,
  pub url: String,
}

/*
 * データベース操作関数
 */
pub async fn fetch_paragraph_block_record_with_relations(
  executor: impl Executor<'_, Database = Postgres> + Copy,
  content_record_id: Uuid,
) -> Result<ParagraphBlockRecordWithRelations> {
  let paragraph_block_record: ParagraphBlockRecord =
    fetch_paragraph_block_by_content_id(executor, content_record_id).await.map_err(|_| anyhow::anyhow!("段落ブロックの取得に失敗しました。"))?;
  let rich_text_records_with_relations: Vec<RichTextRecordWithRelations> =
    fetch_rich_text_relations_by_paragraph(executor, paragraph_block_record.id).await.map_err(|_| anyhow::anyhow!("リッチテキストの取得に失敗しました。"))?;
  let result = ParagraphBlockRecordWithRelations {
    paragraph_block: paragraph_block_record,
    rich_text_records_with_relations,
  };
  Ok(result)
}

pub async fn fetch_rich_text_relations_by_paragraph(
  executor: impl Executor<'_, Database = Postgres> + Copy,
  paragraph_block_id: Uuid,
) -> Result<Vec<RichTextRecordWithRelations>> {
  let rich_texts = fetch_rich_texts_by_paragraph(executor, paragraph_block_id).await?;
  let mut rich_text_with_relations = vec![];
  for rich_text in rich_texts {
    let styles = fetch_styles_by_rich_text_id(executor, rich_text.id).await?;
    let link = fetch_link_by_rich_text_id(executor, rich_text.id).await?;
    rich_text_with_relations.push(RichTextRecordWithRelations {
      text_record: rich_text,
      style_records: styles,
      link_record: link,
    });
  }
  Ok(rich_text_with_relations)
}

pub async fn fetch_paragraph_block_by_content_id(executor: impl Executor<'_, Database = Postgres>, content_id: Uuid) -> Result<ParagraphBlockRecord> {
  let block = sqlx::query_as::<_, ParagraphBlockRecord>("select id from paragraph_blocks where id = $1").bind(content_id).fetch_one(executor).await?;
  Ok(block)
}

// rich_texts を取得
pub async fn fetch_rich_texts_by_paragraph(executor: impl Executor<'_, Database = Postgres>, paragraph_block_id: Uuid) -> Result<Vec<RichTextRecord>> {
  let texts = sqlx::query_as::<_, RichTextRecord>(
    "select id, paragraph_block_id, text_content, sort_order from rich_texts where paragraph_block_id = $1 order by sort_order asc",
  )
  .bind(paragraph_block_id)
  .fetch_all(executor)
  .await?;
  Ok(texts)
}

// rich_text_styles 中間テーブルを使って、特定の rich_texts に対応する style を取得する
pub async fn fetch_styles_by_rich_text_id(executor: impl Executor<'_, Database = Postgres>, rich_text_id: Uuid) -> Result<Vec<TextStyleRecord>> {
  let styles =
    sqlx::query_as::<_, TextStyleRecord>("select id, style_type from text_styles where id in (select style_id from rich_text_styles where rich_text_id = $1)")
      .bind(rich_text_id)
      .fetch_all(executor)
      .await?;
  Ok(styles)
}

pub async fn fetch_text_styles_all(executor: impl Executor<'_, Database = Postgres>) -> Result<Vec<TextStyleRecord>> {
  let styles = sqlx::query_as::<_, TextStyleRecord>("select id, style_type from text_styles").fetch_all(executor).await?;
  Ok(styles)
}

pub async fn fetch_link_by_rich_text_id(executor: impl Executor<'_, Database = Postgres>, rich_text_id: Uuid) -> Result<Option<RichTextLinkRecord>> {
  let link = sqlx::query_as::<_, RichTextLinkRecord>("select id, rich_text_id, url from rich_text_links where rich_text_id = $1")
    .bind(rich_text_id)
    .fetch_optional(executor)
    .await?;
  Ok(link)
}

pub async fn insert_paragraph_block(executor: impl Executor<'_, Database = Postgres>, paragraph_block: ParagraphBlockRecord) -> Result<()> {
  sqlx::query("insert into paragraph_blocks (id) values ($1)").bind(paragraph_block.id).execute(executor).await?;
  Ok(())
}

pub async fn insert_rich_text(executor: impl Executor<'_, Database = Postgres>, rich_text: RichTextRecord) -> Result<()> {
  sqlx::query("insert into rich_texts (id, paragraph_block_id, text_content, sort_order) values ($1, $2, $3, $4)")
    .bind(rich_text.id)
    .bind(rich_text.paragraph_block_id)
    .bind(rich_text.text_content)
    .bind(rich_text.sort_order)
    .execute(executor)
    .await?;
  Ok(())
}

pub async fn insert_rich_text_style(executor: impl Executor<'_, Database = Postgres>, style: RichTextStyleRecord) -> Result<()> {
  sqlx::query("insert into rich_text_styles (style_id, rich_text_id) values ($1, $2)").bind(style.style_id).bind(style.rich_text_id).execute(executor).await?;
  Ok(())
}

pub async fn insert_text_style_if_not_exists(executor: impl Executor<'_, Database = Postgres>, style: TextStyleRecord) -> Result<()> {
  sqlx::query("INSERT INTO text_styles (id, style_type) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING")
    .bind(style.id)
    .bind(style.style_type)
    .execute(executor)
    .await?;
  Ok(())
}

pub async fn insert_rich_text_link(executor: impl Executor<'_, Database = Postgres>, link: RichTextLinkRecord) -> Result<()> {
  sqlx::query("insert into rich_text_links (id, rich_text_id, url) values ($1, $2, $3)")
    .bind(link.id)
    .bind(link.rich_text_id)
    .bind(link.url)
    .execute(executor)
    .await?;
  Ok(())
}

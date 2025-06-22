use anyhow::Result;
use sqlx::{Executor, FromRow, Postgres};
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct HeadingBlockRecord {
  pub id: Uuid,
  pub heading_level: i16,
  pub text_content: String,
}

pub async fn fetch_heading_blocks_by_content_id(executor: impl Executor<'_, Database = Postgres>, content_id: Uuid) -> Result<HeadingBlockRecord> {
  let block = sqlx::query_as::<_, HeadingBlockRecord>("select id, heading_level, text_content from heading_blocks where id = $1")
    .bind(content_id)
    .fetch_one(executor)
    .await?;
  Ok(block)
}

pub async fn insert_heading_block(executor: impl Executor<'_, Database = Postgres>, heading_block: HeadingBlockRecord) -> Result<()> {
  sqlx::query("insert into heading_blocks (id, heading_level, text_content) values ($1, $2, $3)")
    .bind(heading_block.id)
    .bind(heading_block.heading_level)
    .bind(heading_block.text_content)
    .execute(executor)
    .await?;
  Ok(())
}

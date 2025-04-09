use anyhow::{Context, Result};
use sqlx::FromRow;
use uuid::Uuid;

use crate::db::pool::POOL;

/*
 * DB内の各テーブル構造に紐づく構造体正義
 */
#[derive(Debug, FromRow)]
pub struct CodeBlockRecord {
  pub id: Uuid,
  pub title: String,
  pub code: String,
  pub lang: String,
}

/*
 * データベース操作関数
 */
pub async fn insert_code_block(code_block: CodeBlockRecord) -> Result<()> {
  sqlx::query("insert into code_blocks (id, title, code, lang) values ($1, $2, $3, $4)")
    .bind(code_block.id)
    .bind(code_block.title)
    .bind(code_block.code)
    .bind(code_block.lang)
    .execute(&*POOL)
    .await
    .context("コードブロックの挿入に失敗しました。")?;
  Ok(())
}

pub async fn fetch_code_block_by_content_id(content_id: Uuid) -> Result<CodeBlockRecord> {
  let block = sqlx::query_as::<_, CodeBlockRecord>("select id, title, code, lang from code_blocks where id = $1")
    .bind(content_id)
    .fetch_one(&*POOL)
    .await?;
  Ok(block)
}

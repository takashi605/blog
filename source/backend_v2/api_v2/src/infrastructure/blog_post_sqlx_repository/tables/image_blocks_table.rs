use anyhow::{Context, Result};
use sqlx::{Acquire, FromRow, Postgres};
use uuid::Uuid;

use super::images_table::{fetch_image_by_id, ImageRecord};

/*
 * 各レコードの関連をまとめた構造体
 */
#[derive(Debug, FromRow)]
pub struct ImageBlockRecordWithRelations {
  pub image_block_record: ImageBlockRecord,
  pub image_record: ImageRecord,
}

/*
 * DB内の各テーブル構造に紐づく構造体正義
 */
#[derive(Debug, FromRow)]
pub struct ImageBlockRecord {
  pub id: Uuid,
  pub image_id: Uuid,
}

/*
 * データベース操作関数
 */
pub async fn fetch_image_block_record_with_relations(
  executor: impl Acquire<'_, Database = Postgres>,
  content_record_id: Uuid,
) -> Result<ImageBlockRecordWithRelations> {
  let mut conn = executor.acquire().await?;
  let image_block_record: ImageBlockRecord = fetch_image_blocks_by_content_id(&mut *conn, content_record_id).await.context("画像ブロックの取得に失敗しました。")?;
  let image_record = fetch_image_by_id(&mut *conn, image_block_record.image_id).await.context("画像の取得に失敗しました。")?;

  let result = ImageBlockRecordWithRelations {
    image_block_record,
    image_record,
  };
  Ok(result)
}

pub async fn fetch_image_blocks_by_content_id(executor: impl Acquire<'_, Database = Postgres>, content_id: Uuid) -> Result<ImageBlockRecord> {
  let mut conn = executor.acquire().await?;
  let block = sqlx::query_as::<_, ImageBlockRecord>("select id, image_id from image_blocks where id = $1").bind(content_id).fetch_one(&mut *conn).await?;
  Ok(block)
}

pub async fn insert_image_block(executor: impl Acquire<'_, Database = Postgres>, image_block: ImageBlockRecord) -> Result<()> {
  let mut conn = executor.acquire().await?;
  sqlx::query("insert into image_blocks (id, image_id) values ($1, $2)")
    .bind(image_block.id)
    .bind(image_block.image_id)
    .execute(&mut *conn)
    .await
    .context("画像ブロックの挿入に失敗しました。")?;
  Ok(())
}

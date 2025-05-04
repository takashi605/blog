use anyhow::{Context, Result};
use sqlx::{FromRow, PgPool};
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
pub async fn fetch_image_block_record_with_relations(pool: &PgPool, content_record_id: Uuid) -> Result<ImageBlockRecordWithRelations> {
  let image_block_record: ImageBlockRecord = fetch_image_blocks_by_content_id(pool, content_record_id).await.context("画像ブロックの取得に失敗しました。")?;
  let image_record = fetch_image_by_id(image_block_record.image_id).await.context("画像の取得に失敗しました。")?;

  let result = ImageBlockRecordWithRelations {
    image_block_record,
    image_record,
  };
  Ok(result)
}

pub async fn fetch_image_blocks_by_content_id(pool: &sqlx::PgPool, content_id: Uuid) -> Result<ImageBlockRecord> {
  let block = sqlx::query_as::<_, ImageBlockRecord>("select id, image_id from image_blocks where id = $1").bind(content_id).fetch_one(pool).await?;
  Ok(block)
}

pub async fn insert_image_block(pool: &sqlx::PgPool, image_block: ImageBlockRecord) -> Result<()> {
  sqlx::query("insert into image_blocks (id, image_id) values ($1, $2)")
    .bind(image_block.id)
    .bind(image_block.image_id)
    .execute(pool)
    .await
    .context("画像ブロックの挿入に失敗しました。")?;
  Ok(())
}

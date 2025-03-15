use anyhow::{Context, Result};
use sqlx::FromRow;
use uuid::Uuid;

use crate::db::pool::POOL;

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
pub async fn fetch_image_block_record_with_relations(content_record_id: Uuid) -> Result<ImageBlockRecordWithRelations> {
  let image_block_record: ImageBlockRecord = fetch_image_blocks_by_content_id(content_record_id).await.context("画像ブロックの取得に失敗しました。")?;
  let image_record = fetch_image_by_id(image_block_record.image_id).await.context("画像の取得に失敗しました。")?;

  let result = ImageBlockRecordWithRelations {
    image_block_record,
    image_record,
  };
  Ok(result)
}

pub async fn fetch_image_blocks_by_content_id(content_id: Uuid) -> Result<ImageBlockRecord> {
  let block = sqlx::query_as::<_, ImageBlockRecord>("select id, image_id from image_blocks where id = $1").bind(content_id).fetch_one(&*POOL).await?;
  Ok(block)
}

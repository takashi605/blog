use uuid::Uuid;
use sqlx::FromRow;
use anyhow::Result;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct ImageBlockRecord {
    pub id: Uuid,
    pub image_id: Uuid,
}

// TODO Vec で変える必要がないので修正する
pub async fn fetch_image_blocks_by_content_id(content_id: Uuid) -> Result<Vec<ImageBlockRecord>> {
  let blocks = sqlx::query_as::<_, ImageBlockRecord>("select id, image_id from image_blocks where content_id = $1")
    .bind(content_id)
    .fetch_all(&*POOL)
    .await?;
  Ok(blocks)
}

use crate::db::pool::POOL;
use anyhow::Result;
use sqlx::FromRow;
use uuid::Uuid;

use super::{images_table::ImageRecord, post_contents_table::AnyContentBlockRecord};

/*
 * 各レコードの関連をまとめた構造体
 */
#[derive(Debug)]
pub struct BlogPostRecordWithRelations {
  pub blog_post_record: BlogPostRecord,
  pub thumbnail_record: ImageRecord,
  pub content_block_records: Vec<AnyContentBlockRecord>,
}

/*
 * DB内の各テーブル構造に紐づく構造体正義
 */
#[derive(Debug, FromRow)]
pub struct BlogPostRecord {
  pub id: Uuid,
  pub title: String,
  pub thumbnail_image_id: Uuid,
  pub post_date: chrono::NaiveDate,
  pub last_update_date: chrono::NaiveDate,
}

/*
 * データベース操作関数
 */
pub async fn fetch_blog_post_by_id(id: Uuid) -> Result<BlogPostRecord> {
  let post = sqlx::query_as::<_, BlogPostRecord>("select id, title, thumbnail_image_id, post_date, last_update_date from blog_posts where id = $1")
    .bind(id)
    .fetch_one(&*POOL)
    .await?;
  Ok(post)
}

pub async fn insert_blog_post(post: BlogPostRecord) -> Result<()> {
  sqlx::query("insert into blog_posts (id, title, thumbnail_image_id, post_date, last_update_date, published_at) values ($1, $2, $3, $4, $5, $6)")
    .bind(post.id)
    .bind(post.title)
    .bind(post.thumbnail_image_id)
    .bind(post.post_date)
    .bind(post.last_update_date)
    .bind(chrono::Utc::now())
    .execute(&*POOL)
    .await?;
  Ok(())
}

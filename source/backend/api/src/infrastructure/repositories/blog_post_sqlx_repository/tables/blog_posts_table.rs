use anyhow::Result;
use sqlx::{Executor, FromRow, Postgres};
use uuid::Uuid;

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
  pub published_at: chrono::NaiveDate,
}

/*
 * データベース操作関数
 */
pub async fn fetch_blog_post_by_id(executor: impl Executor<'_, Database = Postgres>, id: Uuid) -> Result<BlogPostRecord> {
  let post = sqlx::query_as::<_, BlogPostRecord>(
    "select id, title, thumbnail_image_id, post_date, last_update_date, published_at::date as published_at from blog_posts where id = $1 and published_at < CURRENT_TIMESTAMP",
  )
  .bind(id)
  .fetch_one(executor)
  .await?;
  Ok(post)
}

pub async fn fetch_latest_blog_posts_records_with_limit(executor: impl Executor<'_, Database = Postgres>, limit: Option<u32>) -> Result<Vec<BlogPostRecord>> {
  let mut query = sqlx::QueryBuilder::new(
    "select id, title, thumbnail_image_id, post_date, last_update_date, published_at::date as published_at from blog_posts where published_at < CURRENT_TIMESTAMP order by post_date desc",
  );

  if let Some(limit_value) = limit {
    query.push(" limit ");
    query.push_bind(limit_value as i64);
  }

  let posts = query.build_query_as::<BlogPostRecord>().fetch_all(executor).await?;
  Ok(posts)
}

pub async fn insert_blog_post_with_published_at(executor: impl Executor<'_, Database = Postgres>, post: BlogPostRecord) -> Result<()> {
  let published_at_timestamp = post.published_at.and_hms_opt(0, 0, 0).unwrap().and_utc();
  sqlx::query("INSERT INTO blog_posts (id, title, thumbnail_image_id, post_date, last_update_date, published_at) VALUES ($1, $2, $3, $4, $5, $6)")
    .bind(post.id)
    .bind(post.title)
    .bind(post.thumbnail_image_id)
    .bind(post.post_date)
    .bind(post.last_update_date)
    .bind(published_at_timestamp)
    .execute(executor)
    .await?;
  Ok(())
}

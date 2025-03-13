use crate::db::pool::POOL;
use anyhow::Result;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct PopularPostRecord {
  pub id: Uuid,
  pub post_id: Uuid,
}

pub async fn fetch_all_popular_blog_posts() -> Result<Vec<PopularPostRecord>> {
  // 古い順に3件取得
  let post = sqlx::query_as::<_, PopularPostRecord>("select id, post_id from popular_posts order by updated_at desc limit 3").fetch_all(&*POOL).await?;
  Ok(post)
}

use crate::db::pool::POOL;
use anyhow::Result;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct PickUpPosts {
  pub id: Uuid,
  pub post_id: Uuid,
}

pub async fn fetch_all_pickup_blog_posts() -> Result<Vec<PickUpPosts>> {
  // 古い順に3件取得
  let post = sqlx::query_as::<_, PickUpPosts>("select id, post_id from pickup_posts order by id desc limit 3").fetch_all(&*POOL).await?;
  Ok(post)
}
